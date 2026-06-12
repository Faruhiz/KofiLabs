const INDEX_HTML = "<!DOCTYPE html>\n<html lang=\"en\">\n<head>\n<meta charset=\"UTF-8\">\n<meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">\n<title>Ko-fi Relay Setup</title>\n<link href=\"https://fonts.googleapis.com/css2?family=DM+Mono:wght@400;500&family=Instrument+Serif:ital@0;1&display=swap\" rel=\"stylesheet\">\n<style>\n*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }\n\n:root {\n  --bg:      #0c0c0b;\n  --s1:      #141413;\n  --s2:      #1e1e1c;\n  --s3:      #272724;\n  --b1:      rgba(255,255,255,0.06);\n  --b2:      rgba(255,255,255,0.11);\n  --b3:      rgba(255,255,255,0.2);\n  --tx:      #edeae2;\n  --t2:      #a09d96;\n  --t3:      #65625d;\n  --green:   #4ade80;\n  --gbg:     rgba(74,222,128,0.07);\n  --gbd:     rgba(74,222,128,0.18);\n  --red:     #f87171;\n  --rbg:     rgba(248,113,113,0.07);\n  --rbd:     rgba(248,113,113,0.18);\n  --amber:   #fbbf24;\n  --abg:     rgba(251,191,36,0.07);\n  --abd:     rgba(251,191,36,0.18);\n  --blue:    #60a5fa;\n  --accent:  #c8f5a0;\n  --accdark: #0c0c0b;\n}\n\nhtml { background: var(--bg); color: var(--tx); font-family: 'DM Mono', monospace; font-size: 13px; }\nbody { min-height: 100vh; display: flex; flex-direction: column; align-items: center; justify-content: flex-start; padding: 3rem 1.5rem 5rem; }\n.app { width: 100%; max-width: 520px; }\n\n/* \u2500\u2500 Header \u2500\u2500 */\n.hd { text-align: center; margin-bottom: 2.5rem; }\n.hd-icon { font-size: 32px; margin-bottom: 12px; }\n.hd h1 { font-family: 'Instrument Serif', serif; font-size: 26px; font-weight: 400; letter-spacing: -0.01em; }\n.hd p  { font-size: 12px; color: var(--t3); margin-top: 5px; }\n\n/* \u2500\u2500 Progress \u2500\u2500 */\n.progress { display: flex; align-items: center; gap: 0; margin-bottom: 2.5rem; }\n.step-item { display: flex; flex-direction: column; align-items: center; gap: 5px; flex: 1; position: relative; }\n.step-circle {\n  width: 30px; height: 30px; border-radius: 50%;\n  border: 1px solid var(--b2);\n  display: flex; align-items: center; justify-content: center;\n  font-size: 11px; font-weight: 500; color: var(--t3);\n  background: var(--s1);\n  transition: all .3s; z-index: 1;\n}\n.step-circle.active { border-color: var(--accent); color: var(--accent); background: rgba(200,245,160,0.08); }\n.step-circle.done   { border-color: var(--green); background: var(--gbg); color: var(--green); font-size: 14px; }\n.step-label { font-size: 10px; color: var(--t3); letter-spacing: .04em; text-align: center; transition: color .3s; white-space: nowrap; }\n.step-item.active .step-label { color: var(--t2); }\n.step-item.done   .step-label { color: var(--green); }\n.step-line { flex: 1; height: 1px; background: var(--b2); margin-top: -20px; transition: background .3s; }\n.step-line.done { background: var(--green); }\n\n/* \u2500\u2500 Card \u2500\u2500 */\n.card { background: var(--s1); border: 1px solid var(--b1); border-radius: 16px; padding: 1.75rem; }\n.card-title { font-family: 'Instrument Serif', serif; font-size: 19px; font-weight: 400; margin-bottom: 4px; }\n.card-sub   { font-size: 11px; color: var(--t3); line-height: 1.7; margin-bottom: 1.5rem; }\n\n/* \u2500\u2500 Fields \u2500\u2500 */\n.field { margin-bottom: 12px; }\n.field label { display: block; font-size: 10px; letter-spacing: .09em; text-transform: uppercase; color: var(--t2); margin-bottom: 5px; }\n.iw { position: relative; }\n.field input {\n  width: 100%; background: var(--s2); border: 1px solid var(--b2); border-radius: 8px;\n  padding: 10px 38px 10px 12px; font-family: 'DM Mono', monospace; font-size: 12px;\n  color: var(--tx); outline: none; transition: border-color .15s; letter-spacing: .02em;\n}\n.field input:focus { border-color: var(--b3); }\n.field input::placeholder { color: var(--t3); }\n.field input.valid { border-color: var(--gbd); }\n.eye { position: absolute; right: 10px; top: 50%; transform: translateY(-50%); background: none; border: none; color: var(--t3); cursor: pointer; font-size: 13px; padding: 2px; line-height: 1; }\n.eye:hover { color: var(--t2); }\n.hint { font-size: 10px; color: var(--t3); margin-top: 4px; line-height: 1.6; }\n.hint a { color: var(--blue); text-decoration: none; }\n.hint a:hover { text-decoration: underline; }\ncode { font-family: 'DM Mono', monospace; font-size: 11px; background: var(--s3); padding: 1px 5px; border-radius: 4px; color: var(--t2); }\n\n/* \u2500\u2500 Buttons \u2500\u2500 */\n.btn-primary {\n  width: 100%; margin-top: 1.25rem; padding: 12px;\n  border-radius: 8px; border: none;\n  background: var(--accent); color: var(--accdark);\n  font-family: 'DM Mono', monospace; font-size: 13px; font-weight: 500;\n  cursor: pointer; transition: opacity .15s, transform .1s; letter-spacing: .02em;\n}\n.btn-primary:hover   { opacity: .88; }\n.btn-primary:active  { transform: scale(.98); }\n.btn-primary:disabled { opacity: .3; cursor: not-allowed; }\n.btn-ghost { background: none; border: 1px solid var(--b2); border-radius: 8px; padding: 9px 16px; font-family: 'DM Mono', monospace; font-size: 12px; color: var(--t2); cursor: pointer; transition: all .15s; }\n.btn-ghost:hover { border-color: var(--b3); color: var(--tx); }\n\n/* \u2500\u2500 Alerts \u2500\u2500 */\n.alert { padding: 10px 13px; border-radius: 8px; font-size: 12px; line-height: 1.6; margin-top: 12px; display: none; }\n.alert.show { display: block; }\n.alert.err  { background: var(--rbg); border: 1px solid var(--rbd); color: var(--red); }\n.alert.warn { background: var(--abg); border: 1px solid var(--abd); color: var(--amber); }\n.alert.ok   { background: var(--gbg); border: 1px solid var(--gbd); color: var(--green); }\n\n/* \u2500\u2500 Info box \u2500\u2500 */\n.infobox { background: var(--s2); border: 1px solid var(--b2); border-radius: 10px; padding: 12px 14px; margin-bottom: 14px; font-size: 12px; color: var(--t2); line-height: 1.7; }\n.infobox strong { color: var(--tx); font-weight: 500; }\n.infobox ol { padding-left: 16px; margin-top: 4px; }\n.infobox li { margin-bottom: 3px; }\n\n/* \u2500\u2500 OAuth button \u2500\u2500 */\n.btn-oauth {\n  width: 100%; margin-top: 8px; padding: 11px 16px;\n  border-radius: 8px; border: 1px solid var(--b2);\n  background: var(--s2); color: var(--tx);\n  font-family: 'DM Mono', monospace; font-size: 12px;\n  cursor: pointer; transition: all .15s;\n  display: flex; align-items: center; justify-content: center; gap: 8px;\n}\n.btn-oauth:hover { background: var(--s3); border-color: var(--b3); }\n.btn-oauth .icon { font-size: 16px; }\n.btn-oauth.connected { border-color: var(--gbd); color: var(--green); background: var(--gbg); }\n\n/* \u2500\u2500 Step views \u2500\u2500 */\n.view { display: none; animation: fup .3s ease both; }\n.view.show { display: block; }\n\n/* \u2500\u2500 Deploy log \u2500\u2500 */\n.deploy-log { background: var(--s2); border: 1px solid var(--b2); border-radius: 10px; padding: 12px 14px; margin-top: 14px; font-size: 11px; font-family: 'DM Mono', monospace; line-height: 2; max-height: 200px; overflow-y: auto; display: none; }\n.deploy-log.show { display: block; }\n.log-line { display: flex; gap: 8px; }\n.log-line .licon { flex-shrink: 0; }\n.log-line.ok   .licon { color: var(--green); }\n.log-line.err  .licon { color: var(--red); }\n.log-line.spin .licon { color: var(--amber); animation: spin .8s linear infinite; display: inline-block; }\n.log-line.info .licon { color: var(--t3); }\n\n/* \u2500\u2500 Success card \u2500\u2500 */\n.success-card { text-align: center; padding: 2rem 1.5rem; }\n.success-icon { font-size: 40px; margin-bottom: 14px; }\n.success-title { font-family: 'Instrument Serif', serif; font-size: 22px; font-weight: 400; margin-bottom: 8px; }\n.success-sub   { font-size: 12px; color: var(--t3); line-height: 1.7; margin-bottom: 1.5rem; }\n.webhook-box { background: var(--s2); border: 1px solid var(--gbd); border-radius: 10px; padding: 12px 14px; margin-bottom: 1rem; }\n.webhook-label { font-size: 10px; color: var(--t3); letter-spacing: .08em; text-transform: uppercase; margin-bottom: 6px; }\n.webhook-url { font-size: 12px; color: var(--blue); word-break: break-all; margin-bottom: 8px; }\n.copy-row { display: flex; gap: 8px; justify-content: center; }\n.btn-copy { background: var(--s3); border: 1px solid var(--b2); border-radius: 6px; padding: 5px 12px; font-family: 'DM Mono', monospace; font-size: 11px; color: var(--t2); cursor: pointer; transition: color .15s; }\n.btn-copy:hover { color: var(--tx); }\n.btn-copy.ok { color: var(--green); border-color: var(--gbd); }\n\n.steps-done { text-align: left; margin-top: 1.25rem; }\n.step-done-item { display: flex; align-items: flex-start; gap: 10px; padding: 10px 0; border-bottom: 1px solid var(--b1); font-size: 12px; }\n.step-done-item:last-child { border: none; }\n.step-done-num { width: 20px; height: 20px; border-radius: 50%; background: var(--gbg); border: 1px solid var(--gbd); color: var(--green); font-size: 10px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; margin-top: 1px; }\n.step-done-body { flex: 1; }\n.step-done-title { font-weight: 500; color: var(--tx); margin-bottom: 2px; }\n.step-done-sub   { font-size: 11px; color: var(--t3); }\n\n@keyframes fup  { from { opacity:0; transform:translateY(8px); } to { opacity:1; transform:translateY(0); } }\n@keyframes spin { to { transform: rotate(360deg); } }\n\n.deploy-log::-webkit-scrollbar { width: 3px; }\n.deploy-log::-webkit-scrollbar-thumb { background: var(--b2); border-radius: 2px; }\n</style>\n</head>\n<body>\n<div class=\"app\">\n\n  <div class=\"hd\">\n    <div class=\"hd-icon\">\u2615</div>\n    <h1>Ko-fi Relay Setup</h1>\n    <p>Deploy your Ko-fi \u2192 Streamlabs relay to Cloudflare in 3 steps</p>\n  </div>\n\n  <!-- Progress bar -->\n  <div class=\"progress\">\n    <div class=\"step-item active\" id=\"si-1\">\n      <div class=\"step-circle active\" id=\"sc-1\">1</div>\n      <div class=\"step-label\">Cloudflare</div>\n    </div>\n    <div class=\"step-line\" id=\"sl-1\"></div>\n    <div class=\"step-item\" id=\"si-2\">\n      <div class=\"step-circle\" id=\"sc-2\">2</div>\n      <div class=\"step-label\">Streamlabs</div>\n    </div>\n    <div class=\"step-line\" id=\"sl-2\"></div>\n    <div class=\"step-item\" id=\"si-3\">\n      <div class=\"step-circle\" id=\"sc-3\">3</div>\n      <div class=\"step-label\">Ko-fi</div>\n    </div>\n    <div class=\"step-line\" id=\"sl-3\"></div>\n    <div class=\"step-item\" id=\"si-4\">\n      <div class=\"step-circle\" id=\"sc-4\">4</div>\n      <div class=\"step-label\">Deploy</div>\n    </div>\n  </div>\n\n  <!-- \u2500\u2500 Step 1: Cloudflare \u2500\u2500 -->\n  <div class=\"view show\" id=\"view-1\">\n    <div class=\"card\">\n      <div class=\"card-title\">Connect Cloudflare</div>\n      <div class=\"card-sub\">Your Worker will be deployed to your Cloudflare account \u2014 free tier is more than enough.</div>\n\n      <div class=\"infobox\">\n        <strong>Get your API Token:</strong>\n        <ol>\n          <li>Go to <a href=\"https://dash.cloudflare.com/profile/api-tokens\" target=\"_blank\" style=\"color:var(--blue)\">dash.cloudflare.com/profile/api-tokens</a></li>\n          <li>Click <strong>Create Token</strong> \u2192 use the <strong>Edit Cloudflare Workers</strong> template</li>\n          <li>Click <strong>Continue to Summary</strong> \u2192 <strong>Create Token</strong></li>\n          <li>Copy the token and paste it below</li>\n        </ol>\n      </div>\n\n      <div class=\"field\">\n        <label>Cloudflare API Token</label>\n        <div class=\"iw\">\n          <input type=\"password\" id=\"cf-token\" placeholder=\"Paste your API token here\" oninput=\"chk1()\">\n          <button class=\"eye\" onclick=\"tog('cf-token',this)\" tabindex=\"-1\">\ud83d\udc41</button>\n        </div>\n        <div class=\"hint\">Needs <code>Workers Scripts:Edit</code> permission. Never sent to any server \u2014 used only from your browser.</div>\n      </div>\n\n      <button class=\"btn-oauth\" id=\"cf-verify-btn\" onclick=\"verifyCF()\" disabled>\n        <span class=\"icon\">\u26a1</span> Verify Cloudflare connection\n      </button>\n\n      <div class=\"alert err\" id=\"cf-err\"></div>\n      <div class=\"alert ok\"  id=\"cf-ok\">Connected! Your Cloudflare account is ready.</div>\n\n      <button class=\"btn-primary\" id=\"cf-next\" disabled onclick=\"goStep(2)\">Continue \u2192</button>\n    </div>\n  </div>\n\n  <!-- \u2500\u2500 Step 2: Streamlabs \u2500\u2500 -->\n  <div class=\"view\" id=\"view-2\">\n    <div class=\"card\">\n      <div class=\"card-title\">Connect Streamlabs</div>\n      <div class=\"card-sub\">Click below to authorise via Streamlabs. A browser tab will open \u2014 log in and click Approve. You'll be brought straight back.</div>\n\n      <button class=\"btn-oauth\" id=\"sl-oauth-btn\" onclick=\"startSlOAuth()\">\n        <span class=\"icon\">\ud83d\udd17</span> Connect Streamlabs account\n      </button>\n\n      <div class=\"alert err\" id=\"sl-err\" style=\"margin-top:12px\"></div>\n      <div class=\"alert ok\"  id=\"sl-ok\"  style=\"margin-top:12px\"></div>\n\n      <div style=\"display:flex;gap:8px;margin-top:1.25rem\">\n        <button class=\"btn-ghost\" onclick=\"goStep(1)\">\u2190 Back</button>\n        <button class=\"btn-primary\" id=\"sl-next\" disabled onclick=\"goStep(3)\" style=\"margin-top:0;flex:1\">Continue \u2192</button>\n      </div>\n    </div>\n  </div>\n\n  <!-- \u2500\u2500 Step 3: Ko-fi \u2500\u2500 -->\n  <div class=\"view\" id=\"view-3\">\n    <div class=\"card\">\n      <div class=\"card-title\">Ko-fi verification token</div>\n      <div class=\"card-sub\">Ko-fi signs every webhook with a token so your Worker can verify it's genuine.</div>\n\n      <div class=\"infobox\">\n        <strong>Find your token:</strong>\n        <ol>\n          <li>Go to <a href=\"https://ko-fi.com/manage/webhooks\" target=\"_blank\" style=\"color:var(--blue)\">ko-fi.com/manage/webhooks</a></li>\n          <li>Copy the <strong>Verification Token</strong> shown on that page</li>\n          <li>You'll paste your Worker URL back here after deploy</li>\n        </ol>\n      </div>\n\n      <div class=\"field\">\n        <label>Ko-fi Verification Token</label>\n        <div class=\"iw\">\n          <input type=\"password\" id=\"kf-token\" placeholder=\"Paste from Ko-fi webhooks page\" oninput=\"chk3()\">\n          <button class=\"eye\" onclick=\"tog('kf-token',this)\" tabindex=\"-1\">\ud83d\udc41</button>\n        </div>\n        <div class=\"hint\">This gets stored as an encrypted Worker secret. Ko-fi will reject webhooks if they don't match.</div>\n      </div>\n\n      <div class=\"field\">\n        <label>Worker name <span style=\"color:var(--t3);font-size:10px\">(optional)</span></label>\n        <input type=\"text\" id=\"worker-name\" placeholder=\"kofi-streamlabs-relay\" value=\"kofi-streamlabs-relay\" style=\"padding-right:12px\">\n        <div class=\"hint\">The name your Worker appears as in Cloudflare dashboard.</div>\n      </div>\n\n      <div class=\"alert err\" id=\"kf-err\"></div>\n\n      <div style=\"display:flex;gap:8px;margin-top:1.25rem\">\n        <button class=\"btn-ghost\" onclick=\"goStep(2)\">\u2190 Back</button>\n        <button class=\"btn-primary\" id=\"kf-next\" disabled onclick=\"goStep(4)\" style=\"margin-top:0;flex:1\">Deploy Worker \u2192</button>\n      </div>\n    </div>\n  </div>\n\n  <!-- \u2500\u2500 Step 4: Deploy \u2500\u2500 -->\n  <div class=\"view\" id=\"view-4\">\n    <div class=\"card\">\n      <div class=\"card-title\">Deploying your Worker</div>\n      <div class=\"card-sub\">Uploading the relay script to Cloudflare and setting your secrets...</div>\n\n      <div class=\"deploy-log show\" id=\"deploy-log\"></div>\n      <div class=\"alert err\" id=\"deploy-err\"></div>\n    </div>\n  </div>\n\n  <!-- \u2500\u2500 Success \u2500\u2500 -->\n  <div class=\"view\" id=\"view-success\">\n    <div class=\"card success-card\">\n      <div class=\"success-icon\">\ud83c\udf89</div>\n      <div class=\"success-title\">Relay is live!</div>\n      <div class=\"success-sub\">Your Cloudflare Worker is deployed and running. Paste the webhook URL into Ko-fi to complete setup.</div>\n\n      <div class=\"webhook-box\">\n        <div class=\"webhook-label\">Your webhook URL</div>\n        <div class=\"webhook-url\" id=\"final-url\">\u2014</div>\n        <div class=\"copy-row\">\n          <button class=\"btn-copy\" id=\"copy-btn\" onclick=\"copyUrl()\">Copy URL</button>\n          <a id=\"kofi-link\" href=\"https://ko-fi.com/manage/webhooks\" target=\"_blank\" style=\"text-decoration:none\">\n            <button class=\"btn-copy\">Open Ko-fi Webhooks \u2192</button>\n          </a>\n        </div>\n      </div>\n\n      <div class=\"steps-done\">\n        <div class=\"step-done-item\">\n          <div class=\"step-done-num\">\u2713</div>\n          <div class=\"step-done-body\">\n            <div class=\"step-done-title\">Worker deployed</div>\n            <div class=\"step-done-sub\" id=\"sd-worker\">\u2014</div>\n          </div>\n        </div>\n        <div class=\"step-done-item\">\n          <div class=\"step-done-num\">\u2713</div>\n          <div class=\"step-done-body\">\n            <div class=\"step-done-title\">Secrets stored</div>\n            <div class=\"step-done-sub\">Streamlabs token + Ko-fi token encrypted in Cloudflare</div>\n          </div>\n        </div>\n        <div class=\"step-done-item\">\n          <div class=\"step-done-num\">2</div>\n          <div class=\"step-done-body\">\n            <div class=\"step-done-title\">Paste webhook URL into Ko-fi</div>\n            <div class=\"step-done-sub\">Ko-fi \u2192 More \u2192 API/Webhooks \u2192 paste the URL above</div>\n          </div>\n        </div>\n      </div>\n\n      <button class=\"btn-primary\" style=\"margin-top:1.5rem\" onclick=\"window.open('https://ko-fi.com/manage/webhooks','_blank')\">\n        Open Ko-fi to finish setup \u2192\n      </button>\n    </div>\n  </div>\n\n</div>\n\n<script>\n// \u2500\u2500 State \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\nconst S = { cfToken:'', cfAccount:'', slToken:'', kfToken:'', workerName:'kofi-streamlabs-relay', cfVerified:false };\n\n// \u2500\u2500 Helpers \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\nfunction tog(id, btn) {\n  const el = document.getElementById(id);\n  el.type = el.type==='password' ? 'text' : 'password';\n  btn.textContent = el.type==='password' ? '\ud83d\udc41' : '\ud83d\ude48';\n}\n\nfunction showAlert(id, msg) {\n  const el = document.getElementById(id);\n  if (msg) { el.textContent = msg; el.classList.add('show'); }\n  else el.classList.remove('show');\n}\n\nfunction goStep(n) {\n  [1,2,3,4,'success'].forEach(s => {\n    const v = document.getElementById(`view-${s}`);\n    if (v) v.classList.remove('show');\n  });\n  document.getElementById(`view-${n}`).classList.add('show');\n  updateProgress(n);\n  if (n===4) deploy();\n}\n\nfunction updateProgress(step) {\n  for (let i=1; i<=4; i++) {\n    const si = document.getElementById(`si-${i}`);\n    const sc = document.getElementById(`sc-${i}`);\n    si.classList.remove('active','done');\n    sc.classList.remove('active','done');\n    if (i < step)      { si.classList.add('done');   sc.classList.add('done');   sc.textContent='\u2713'; }\n    else if (i===step) { si.classList.add('active');  sc.classList.add('active'); }\n    else { sc.textContent = i; }\n  }\n  for (let i=1; i<=3; i++) {\n    document.getElementById(`sl-${i}`).classList.toggle('done', i < step);\n  }\n}\n\n// \u2500\u2500 Step 1 checks \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\nfunction chk1() {\n  const t = document.getElementById('cf-token').value.trim();\n  document.getElementById('cf-verify-btn').disabled = !t;\n  document.getElementById('cf-next').disabled = !S.cfVerified;\n}\n\nasync function verifyCF() {\n  const btn = document.getElementById('cf-verify-btn');\n  const token = document.getElementById('cf-token').value.trim();\n  showAlert('cf-err',''); showAlert('cf-ok','');\n  btn.disabled = true; btn.innerHTML = '<span class=\"icon\">\u23f3</span> Verifying...';\n\n  try {\n    const r = await fetch('/api/cf/verify', {\n      method: 'POST',\n      headers: { 'Content-Type': 'application/json' },\n      body: JSON.stringify({ token })\n    });\n    const d = await r.json();\n    if (!r.ok) throw new Error(d.error || `Error ${r.status}`);\n    S.cfToken = token;\n    S.cfAccount = d.accountId;\n    S.cfAccountName = d.accountName;\n    S.cfVerified = true;\n    showAlert('cf-ok', `\u2713 Connected as \"${S.cfAccountName}\" \u2014 ready to deploy.`);\n    document.getElementById('cf-next').disabled = false;\n    btn.innerHTML = '<span class=\"icon\">\u2713</span> Connected';\n    btn.classList.add('connected');\n  } catch(e) {\n    showAlert('cf-err', 'Connection failed: ' + e.message);\n    btn.disabled = false; btn.innerHTML = '<span class=\"icon\">\u26a1</span> Verify Cloudflare connection';\n  }\n}\n\n// \u2500\u2500 Step 2: Streamlabs OAuth \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\nfunction startSlOAuth() {\n  const btn = document.getElementById('sl-oauth-btn');\n  btn.innerHTML = '<span class=\"icon\">\u23f3</span> Waiting for authorisation...';\n  btn.disabled = true;\n  showAlert('sl-err', '');\n\n  // Open OAuth in a new tab\n  window.open('/api/sl/oauth/start', '_blank');\n\n  // Poll for the token (server stores it after callback)\n  const poll = setInterval(async () => {\n    try {\n      const r = await fetch('/api/sl/oauth/token');\n      const d = await r.json();\n      if (d.token) {\n        clearInterval(poll);\n        S.slToken = d.token;\n        btn.innerHTML = '<span class=\"icon\">\u2713</span> Streamlabs connected';\n        btn.classList.add('connected');\n        showAlert('sl-ok', `\u2713 Connected as \"${d.displayName}\"`);\n        document.getElementById('sl-next').disabled = false;\n      }\n    } catch {}\n  }, 1500);\n\n  // Stop polling after 5 min\n  setTimeout(() => {\n    clearInterval(poll);\n    if (!S.slToken) {\n      btn.innerHTML = '<span class=\"icon\">\ud83d\udd17</span> Connect Streamlabs account';\n      btn.disabled = false;\n      showAlert('sl-err', 'Timed out. Please try again.');\n    }\n  }, 300000);\n}\n\n// \u2500\u2500 Step 3 checks \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\nfunction chk3() {\n  const v = document.getElementById('kf-token').value.trim();\n  const n = document.getElementById('worker-name').value.trim();\n  document.getElementById('kf-next').disabled = !v;\n  if (v) S.kfToken = v;\n  if (n) S.workerName = n;\n}\n\n// \u2500\u2500 Worker script \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\nfunction workerScript() {\n  return `const SUPPORTED_CURRENCIES=[\"AUD\",\"BRL\",\"CAD\",\"CZK\",\"DKK\",\"EUR\",\"HKD\",\"ILS\",\"MYR\",\"MXN\",\"NOK\",\"NZD\",\"PHP\",\"PLN\",\"GBP\",\"RUB\",\"SGD\",\"SEK\",\"CHF\",\"THB\",\"TRY\",\"USD\"];\n\nexport default {\n  async fetch(request, env) {\n    if (request.method !== \"POST\") {\n      return new Response(\"Ko-fi Relay is running.\", { status: 200 });\n    }\n    let kofi;\n    try {\n      const form = await request.formData();\n      kofi = JSON.parse(form.get(\"data\") || \"{}\");\n    } catch {\n      return new Response(\"Bad payload\", { status: 400 });\n    }\n    if (kofi.verification_token !== env.KOFI_VERIFICATION_TOKEN) {\n      return new Response(\"Unauthorized\", { status: 401 });\n    }\n    let currency = (kofi.currency || \"USD\").toUpperCase();\n    if (!SUPPORTED_CURRENCIES.includes(currency)) currency = \"USD\";\n    const params = new URLSearchParams({\n      name: (kofi.from_name || \"Anonymous\").slice(0, 25),\n      identifier: kofi.email || kofi.kofi_transaction_id || (\"kofi-\" + Date.now()),\n      message: (kofi.message || \"\").slice(0, 255),\n      amount: kofi.amount || \"0\",\n      currency,\n    });\n    const res = await fetch(\"https://streamlabs.com/api/v2.0/donations\", {\n      method: \"POST\",\n      headers: {\n        \"Content-Type\": \"application/x-www-form-urlencoded\",\n        \"Accept\": \"application/json\",\n        \"Authorization\": \"Bearer \" + env.STREAMLABS_ACCESS_TOKEN,\n      },\n      body: params,\n    });\n    if (!res.ok) console.error(\"Streamlabs error\", res.status, await res.text());\n    return new Response(\"OK\", { status: 200 });\n  }\n};`;\n}\n\n// \u2500\u2500 Deploy \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\nlet logLines = [];\nfunction addLog(type, msg) {\n  const icons = { ok:'\u2713', err:'\u2717', spin:'\u25cc', info:'\u00b7' };\n  logLines.push({ type, msg });\n  document.getElementById('deploy-log').innerHTML = logLines.map(l =>\n    `<div class=\"log-line ${l.type}\"><span class=\"licon\">${icons[l.type]||'\u00b7'}</span><span>${l.msg}</span></div>`\n  ).join('');\n}\n\nasync function deploy() {\n  logLines = [];\n  showAlert('deploy-err','');\n  const workerName = document.getElementById('worker-name').value.trim() || 'kofi-streamlabs-relay';\n  S.workerName = workerName;\n\n  const post = (path, body) => fetch(path, {\n    method: 'POST',\n    headers: { 'Content-Type': 'application/json' },\n    body: JSON.stringify(body)\n  }).then(async r => {\n    const d = await r.json();\n    if (!r.ok) throw new Error(d.error || `Error ${r.status}`);\n    return d;\n  });\n\n  try {\n    // 1. Upload script\n    addLog('spin', 'Uploading Worker script...');\n    await post('/api/cf/deploy', { token: S.cfToken, accountId: S.cfAccount, workerName, script: workerScript() });\n    logLines[logLines.length-1] = { type:'ok', msg:'Worker script uploaded' };\n\n    // 2. Set Streamlabs secret\n    addLog('spin', 'Setting Streamlabs secret...');\n    await post('/api/cf/secret', { token: S.cfToken, accountId: S.cfAccount, workerName, name: 'STREAMLABS_ACCESS_TOKEN', value: S.slToken });\n    logLines[logLines.length-1] = { type:'ok', msg:'Streamlabs token stored as secret' };\n\n    // 3. Set Ko-fi secret\n    addLog('spin', 'Setting Ko-fi verification token...');\n    await post('/api/cf/secret', { token: S.cfToken, accountId: S.cfAccount, workerName, name: 'KOFI_VERIFICATION_TOKEN', value: S.kfToken });\n    logLines[logLines.length-1] = { type:'ok', msg:'Ko-fi token stored as secret' };\n\n    // 4. Get subdomain\n    addLog('spin', 'Fetching Worker URL...');\n    const sub = await post('/api/cf/subdomain', { token: S.cfToken, accountId: S.cfAccount });\n    logLines[logLines.length-1] = { type:'ok', msg:'Worker is live' };\n    addLog('ok', 'All done!');\n\n    renderLog();\n\n    const workerUrl = sub.subdomain\n      ? `https://${workerName}.${sub.subdomain}.workers.dev`\n      : `https://${workerName}.<your-subdomain>.workers.dev`;\n\n    document.getElementById('final-url').textContent = workerUrl;\n    document.getElementById('sd-worker').textContent = `${workerName}.workers.dev`;\n    updateProgress(5);\n\n    setTimeout(() => {\n      document.getElementById('view-4').classList.remove('show');\n      document.getElementById('view-success').classList.add('show');\n    }, 600);\n\n  } catch(e) {\n    if (logLines.length) logLines[logLines.length-1].type = 'err';\n    renderLog();\n    showAlert('deploy-err', '\u2717 Deploy failed: ' + e.message);\n  }\n}\n\nfunction renderLog() {\n  const icons = { ok:'\u2713', err:'\u2717', spin:'\u25cc', info:'\u00b7' };\n  document.getElementById('deploy-log').innerHTML = logLines.map(l =>\n    `<div class=\"log-line ${l.type}\"><span class=\"licon\">${icons[l.type]||'\u00b7'}</span><span>${l.msg}</span></div>`\n  ).join('');\n}\n\nfunction copyUrl() {\n  const url = document.getElementById('final-url').textContent;\n  navigator.clipboard.writeText(url);\n  const btn = document.getElementById('copy-btn');\n  btn.textContent = 'Copied!'; btn.classList.add('ok');\n  setTimeout(() => { btn.textContent = 'Copy URL'; btn.classList.remove('ok'); }, 1500);\n}\n\n\n</script>\n</body>\n</html>\n";

const http = require('http');
const https = require('https');

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
        res.end(`<html><head><style>*{margin:0;padding:0;box-sizing:border-box}body{font-family:'DM Mono',monospace;background:#0c0c0b;color:#edeae2;min-height:100vh;display:flex;align-items:center;justify-content:center;text-align:center}.box{background:#141413;border:1px solid rgba(255,255,255,0.08);border-radius:16px;padding:2rem 2.5rem}.icon{font-size:40px;margin-bottom:1rem}.title{font-size:20px;margin-bottom:8px}.sub{font-size:12px;color:#65625d;line-height:1.6}</style></head><body><div class="box"><div class="icon">✓</div><div class="title">Connected!</div><div class="sub">Streamlabs authorised.<br>You can close this tab and return to the setup app.</div></div></body></html>`);
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
  console.log('  Ko-fi Relay Setup');
  console.log(`  Open: http://localhost:${PORT}`);
  console.log('');
});
