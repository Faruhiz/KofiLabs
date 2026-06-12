const http = require('http');
const https = require('https');
const fs    = require('fs');
const path  = require('path');

const { exec } = require('child_process');

// Read the HTML file once when the server starts
const INDEX_HTML = fs.readFileSync(path.join(__dirname, 'app.html'), 'utf8');

const PORT = 3456;

const SL_CLIENT_ID     = 'a1fbf6a9-2555-47bc-9a42-29955fc1bcac';
const SL_REDIRECT_URI  = `http://localhost:${PORT}/oauth/callback`;
const SL_AUTH_URL      = `https://streamlabs.com/api/v2.0/authorize?client_id=${SL_CLIENT_ID}&redirect_uri=${encodeURIComponent(SL_REDIRECT_URI)}&response_type=code&scope=donations.create`;

const PROXY_URL = 'https://kofilabs-proxy.jaus-kgg.workers.dev';

// In-memory store for the OAuth token after callback
let slOAuthResult = null;

function parseBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', c => body += c);
    req.on('end', () => { try { resolve(JSON.parse(body)); } catch { resolve({}); } });
    req.on('error', reject);
  });
}

function jsonRes(res, code, data) {
  res.writeHead(code, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(data));
}

// ── Proxy helper ─────────────────────────────────────────────────────────────
function cfRequest(method, cfPath, token, body) {
  return new Promise((resolve, reject) => {
    const bodyStr = body ? JSON.stringify(body) : null;
    const options = {
      hostname: 'api.cloudflare.com',
      path: `/client/v4${cfPath}`,
      method,
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json',
        ...(bodyStr ? { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(bodyStr) } : {})
      }
    };
    const req = https.request(options, res => {
      let data = '';
      res.on('data', d => data += d);
      res.on('end', () => {
        try { resolve({ status: res.statusCode, body: JSON.parse(data) }); }
        catch { resolve({ status: res.statusCode, body: data }); }
      });
    });
    req.on('error', reject);
    if (bodyStr) req.write(bodyStr);
    req.end();
  });
}

// Raw form/multipart proxy for Worker script upload
function cfUpload(cfPath, token, scriptContent, workerName) {
  return new Promise((resolve, reject) => {
    const boundary = '----CFBoundary' + Date.now();
    const metadata = JSON.stringify({ main_module: 'worker.js', compatibility_date: '2024-01-01' });

    const body = Buffer.concat([
      Buffer.from(`--${boundary}\r\nContent-Disposition: form-data; name="metadata"; filename="metadata.json"\r\nContent-Type: application/json\r\n\r\n`),
      Buffer.from(metadata),
      Buffer.from(`\r\n--${boundary}\r\nContent-Disposition: form-data; name="worker.js"; filename="worker.js"\r\nContent-Type: application/javascript+module\r\n\r\n`),
      Buffer.from(scriptContent),
      Buffer.from(`\r\n--${boundary}--\r\n`),
    ]);

    const options = {
      hostname: 'api.cloudflare.com',
      path: `/client/v4${cfPath}`,
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': `multipart/form-data; boundary=${boundary}`,
        'Content-Length': body.length,
      }
    };

    const req = https.request(options, res => {
      let data = '';
      res.on('data', d => data += d);
      res.on('end', () => {
        try { resolve({ status: res.statusCode, body: JSON.parse(data) }); }
        catch { resolve({ status: res.statusCode, body: data }); }
      });
    });
    req.on('error', reject);
    req.write(body);
    req.end();
  });
}

// Streamlabs: exchange auth code for access token and get user info
function exchangeSlCode(code) {
  return new Promise((resolve, reject) => {
    
    // We only send the code and the redirect URI to our proxy
    const bodyStr = JSON.stringify({
      code: code,
      redirect_uri: SL_REDIRECT_URI
    });

    const proxyUrlObj = new URL(PROXY_URL);

    const req = https.request({
      hostname: proxyUrlObj.hostname,
      path: proxyUrlObj.pathname,
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(bodyStr) 
      }
    }, res => {
      let data = '';
      res.on('data', d => data += d);
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          if (!json.access_token) throw new Error(json.message || 'No access token returned');
          resolve(json);
        } catch(e) { reject(e); }
      });
    });
    
    req.on('error', reject); 
    req.write(bodyStr); 
    req.end();
  });
}

// ── HTTP Server ───────────────────────────────────────────────────────────────
const server = http.createServer(async (req, res) => {
  const url = req.url.split('?')[0];

  // Serve static files
  if (req.method === 'GET') {
    // Start OAuth — redirect browser to Streamlabs
    if (url === '/api/sl/oauth/start') {
      res.writeHead(302, { Location: SL_AUTH_URL });
      res.end();
      return;
    }

    // OAuth callback — Streamlabs redirects here with ?code=...
    if (url === '/oauth/callback') {
      const qs = new URLSearchParams(req.url.split('?')[1] || '');
      const code = qs.get('code');
      if (!code) {
        res.writeHead(400, { 'Content-Type': 'text/html' });
        res.end('<html><body style="font-family:sans-serif;padding:2rem;background:#0c0c0b;color:#f87171"><h2>Error</h2><p>No code returned from Streamlabs.</p></body></html>');
        return;
      }
      // Exchange code for token
      try {
        const token = await exchangeSlCode(code);
        slOAuthResult = token;
        res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
        res.end(`<html><head><style>*{margin:0;padding:0;box-sizing:border-box}body{font-family:'DM Mono',monospace;background:#0c0c0b;color:#edeae2;min-height:100vh;display:flex;align-items:center;justify-content:center;text-align:center}.box{background:#141413;border:1px solid rgba(255,255,255,0.08);border-radius:16px;padding:2rem 2.5rem}.icon{font-size:40px;margin-bottom:1rem}.title{font-size:20px;margin-bottom:8px}.sub{font-size:12px;color:#65625d;line-height:1.6}</style></head><body><div class="box"><div class="icon">✓</div><div class="title">Connected!</div><div class="sub">Streamlabs Authorized.<br>You can close this tab and return to the setup app.</div></div></body></html>`);
      } catch (e) {
        res.writeHead(500, { 'Content-Type': 'text/html; charset=utf-8' });
        res.end(`<html><body style="font-family:sans-serif;padding:2rem;background:#0c0c0b;color:#f87171"><h2>Error</h2><p>${e.message}</p></body></html>`);
      }
      return;
    }

    // Poll endpoint — UI polls this until token is ready
    if (url === '/api/sl/oauth/token') {
      if (slOAuthResult) {
        const result = slOAuthResult;
        slOAuthResult = null; // clear after first read
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ token: result.access_token, displayName: result.display_name }));
      } else {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ token: null }));
      }
      return;
    }

    if (url === '/') {
      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.end(INDEX_HTML);
      return;
    }
    res.writeHead(404); res.end('Not found');
    return;
  }

  if (req.method !== 'POST') { res.writeHead(405); res.end(); return; }

  const body = await parseBody(req);

  if (url === '/api/cf/verify') {
    const { token } = body;
    if (!token) return jsonRes(res, 400, { error: 'Token required' });
    try {
      const r = await cfRequest('GET', '/accounts?per_page=1', token);
      if (r.status < 200 || r.status >= 300) return jsonRes(res, 400, { error: r.body?.errors?.[0]?.message || `CF error ${r.status}` });
      const accounts = r.body.result;
      if (!accounts?.length) return jsonRes(res, 400, { error: 'No Cloudflare accounts found for this token.' });
      jsonRes(res, 200, { accountId: accounts[0].id, accountName: accounts[0].name });
    } catch (e) { jsonRes(res, 500, { error: e.message }); }
    return;
  }

  if (url === '/api/cf/deploy') {
    const { token, accountId, workerName, script } = body;
    if (!token || !accountId || !workerName || !script) return jsonRes(res, 400, { error: 'Missing fields' });
    try {
      const r = await cfUpload(`/accounts/${accountId}/workers/scripts/${workerName}`, token, script);
      if (r.status < 200 || r.status >= 300) return jsonRes(res, 400, { error: r.body?.errors?.[0]?.message || `CF error ${r.status}` });
      jsonRes(res, 200, { ok: true });
    } catch (e) { jsonRes(res, 500, { error: e.message }); }
    return;
  }

  if (url === '/api/cf/secret') {
    const { token, accountId, workerName, name, value } = body;
    if (!token || !accountId || !workerName || !name || !value) return jsonRes(res, 400, { error: 'Missing fields' });
    try {
      const r = await cfRequest('PUT', `/accounts/${accountId}/workers/scripts/${workerName}/secrets`, token, { name, text: value, type: 'secret_text' });
      if (r.status < 200 || r.status >= 300) return jsonRes(res, 400, { error: r.body?.errors?.[0]?.message || `CF error ${r.status}` });
      jsonRes(res, 200, { ok: true });
    } catch (e) { jsonRes(res, 500, { error: e.message }); }
    return;
  }

  // Enable the workers.dev route
  if (url === '/api/cf/enable-route') {
    const { token, accountId, workerName } = body;
    if (!token || !accountId || !workerName) return jsonRes(res, 400, { error: 'Missing fields' });
    try {
      const r = await cfRequest('POST', `/accounts/${accountId}/workers/scripts/${workerName}/subdomain`, token, { enabled: true });
      if (r.status !== 200 && r.status !== 201) return jsonRes(res, 400, { error: r.body?.errors?.[0]?.message || `CF error ${r.status}` });
      jsonRes(res, 200, { ok: true });
    } catch(e) { jsonRes(res, 500, { error: e.message }); }
    return;
  }

  if (url === '/api/cf/subdomain') {
    const { token, accountId } = body;
    try {
      const r = await cfRequest('GET', `/accounts/${accountId}/workers/subdomain`, token);
      jsonRes(res, 200, { subdomain: r.body?.result?.subdomain || null });
    } catch { jsonRes(res, 200, { subdomain: null }); }
    return;
  }

  res.writeHead(404); res.end('Not found');
});

server.listen(PORT, () => {
  console.log('');
  console.log('  KofiLabs Setup');
  console.log(`  Open: http://localhost:${PORT}`);
  console.log('');

  const url = `http://localhost:${PORT}`;

  const command = `explorer ${url}`;

  exec(command, (err) => {
        if (err) return;
    });
});
