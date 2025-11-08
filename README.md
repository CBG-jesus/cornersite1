# Cornersites - Static site + Netlify function to send contact emails

## Files
- `index.html` — your website (client).
- `netlify/functions/send-email.js` — Netlify serverless function that sends mail via SMTP.
- `package.json` — lists nodemailer dependency.
- `netlify.toml` — Netlify settings.

## How it works
The contact form in `index.html` POSTs JSON to `/.netlify/functions/send-email`. The function uses `nodemailer` and SMTP to forward the message to the `TO_EMAIL` address.

## Required environment variables (set in Netlify dashboard)
Set these in Netlify UI under **Site settings → Build & deploy → Environment**:

- `SMTP_HOST` — (optional) default `smtp.gmail.com`
- `SMTP_PORT` — (optional) default `587`
- `SMTP_USER` — SMTP username (e.g. `you@gmail.com`)
- `SMTP_PASS` — SMTP password or app password (see note)
- `TO_EMAIL` — `cornercartonlinemarket@gmail.com` (or your preferred receiver)
- `FROM_EMAIL` — optional (defaults to `SMTP_USER`)

### Gmail note
If using Gmail:
- Enable **2FA** on the Gmail account you send from.
- Create an **App Password** (Google Account → Security → App passwords) and use that as `SMTP_PASS`.
- Do not use your normal Gmail password.

## Local testing with Netlify CLI
1. Install Netlify CLI globally: `npm i -g netlify-cli`
2. Install dependencies: `npm install`
3. Run: `netlify dev`
4. Open `http://localhost:8888` and test the contact form. Serverless function logs will appear in the terminal.

## Deploy to Netlify
1. Push repo to GitHub.
2. Create a site on Netlify ("New site from Git").
3. Connect your GitHub repo.
4. Add the environment variables in Netlify settings.
5. Deploy. Form submissions will hit the function and be emailed.

## Troubleshooting
- Check function logs in Netlify UI if emails don't arrive.
- Check spam folder.
- If Gmail blocks sign-in, re-create App Password and confirm SMTP_USER matches the account.
- Consider SendGrid/Mailgun if deliverability issues continue.