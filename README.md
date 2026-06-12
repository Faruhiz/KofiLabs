# ☕ KofiLabs: Ko-fi to Streamlabs Relay

A lightweight, open-source setup wizard that securely bridges Ko-fi donations to Streamlabs, triggering real-time alert widgets on your live stream. 

---

## 🔒 Security & Privacy (Zero-Trust Architecture)

Streamers trust their tools with their income and their infrastructure. KofiLabs is built with a **"Zero-Server" architecture** to guarantee your data stays entirely in your hands.

* **I do not run a central server.** This setup wizard does not send your data to any database I own. Instead, it logs into *your* free Cloudflare account and builds a private relay exclusively for you. The data travels strictly between **Ko-fi ➔ Your Cloudflare Account ➔ Streamlabs**. I am never in the middle.
* **Your API Tokens never leave your control.** The Cloudflare API token you provide is processed entirely on your local machine. It is never transmitted to any third-party analytics or external databases.
* **Strictly Scoped Permissions.** The setup wizard only asks for the exact minimum permissions required:
  * **Cloudflare:** `Workers Scripts: Edit` (Used exactly once to upload the relay script to your account).
  * **Streamlabs:** `donations.create` (Used only by your private Worker to push the on-screen visual alert).
* **Open Source.** The entire source code for the setup wizard and the Cloudflare Worker is available in this repository. The `.exe` releases are compiled automatically by GitHub Actions, guaranteeing the file you download exactly matches the code you see here.

*(Note: The only external network call this application makes during setup is to an open-source OAuth proxy used strictly to exchange your Streamlabs login code for an access token. This proxy exists purely to keep the Streamlabs developer secret hidden from the public `.exe` and stores no data).*

---

## 🚀 How it Works

KofiLabs provides a clean, local UI that automates the deployment of a **Cloudflare Worker**. 
1. The Cloudflare Worker sits silently in the background on Cloudflare's free tier.
2. When someone donates on Ko-fi, Ko-fi sends a secure Webhook to your Worker.
3. The Worker instantly translates that data and pushes it to your Streamlabs Alert Box.

---

## 🛠️ Quick Start Guide

### Prerequisites
* A free [Cloudflare](https://dash.cloudflare.com/sign-up) account.
* Your Streamlabs account.
* Your Ko-fi page.

### Setup Instructions
1. **Download the App:** Grab the latest `.exe` release from the Project Releases page.
2. **Run KofiLabs:** Double-click the application. A setup wizard will open in your browser at `http://localhost:3456`.
3. **Step 1 - Cloudflare Token:** Follow the on-screen link to generate a Cloudflare API token with `Workers Scripts: Edit` permissions. Paste it into the app.
4. **Step 2 - Streamlabs Auth:** Click the "Connect Streamlabs" button to log in and securely authorize the app to push donation alerts.
5. **Step 3 - Ko-fi Token:** Paste your Ko-fi Verification Token (found on your Ko-fi Webhooks page) so your Worker knows to only accept genuine donations.
6. **Deploy:** Click Deploy! The wizard will upload the script, secure your secrets, and give you a final Webhook URL.
7. **Final Step:** Paste that Webhook URL into your Ko-fi settings. You are done!

---

## 💻 Running from Source

If you prefer to audit the code and run the setup wizard yourself via Node.js instead of using the pre-compiled executable:

```bash
# Clone the repository
git clone https://github.com/Faruhiz/KofiLabs.git
cd KofiLabs
```

```bash
# Install dependencies (if any is required in the future)
npm install
```

```bash
# Run the local setup server
node server.js
```