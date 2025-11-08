const nodemailer = require('nodemailer');

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Allow-Methods': 'POST,OPTIONS'
};

exports.handler = async (event, context) => {
  try {
    if (event.httpMethod === 'OPTIONS') {
      return { statusCode: 200, headers: CORS_HEADERS, body: '' };
    }
    if (event.httpMethod !== 'POST') {
      return { statusCode: 405, headers: CORS_HEADERS, body: JSON.stringify({ error: 'Method Not Allowed' }) };
    }

    const data = JSON.parse(event.body || '{}');
    const { name, email, phone = '', subject = 'Website contact', message = '', page = '' } = data;

    if (!name || !email || !message) {
      return { statusCode: 400, headers: CORS_HEADERS, body: JSON.stringify({ error: 'Missing required fields' }) };
    }

    // Environment variables (set these in Netlify)
    const SMTP_HOST = process.env.SMTP_HOST || 'smtp.gmail.com';
    const SMTP_PORT = Number(process.env.SMTP_PORT || 587);
    const SMTP_USER = process.env.SMTP_USER;
    const SMTP_PASS = process.env.SMTP_PASS;
    const TO_EMAIL = process.env.TO_EMAIL || 'cornercartonlinemarket@gmail.com';
    const FROM_EMAIL = process.env.FROM_EMAIL || SMTP_USER;

    if (!SMTP_USER || !SMTP_PASS) {
      console.error('SMTP credentials not configured');
      return { statusCode: 500, headers: CORS_HEADERS, body: JSON.stringify({ error: 'SMTP not configured' }) };
    }

    const transporter = nodemailer.createTransport({
      host: SMTP_HOST,
      port: SMTP_PORT,
      secure: SMTP_PORT === 465,
      auth: { user: SMTP_USER, pass: SMTP_PASS }
    });

    const mailOptions = {
      from: `"Cornersites Contact" <${FROM_EMAIL}>`,
      to: TO_EMAIL,
      subject: `${subject} — from ${name}`,
      text:
`New message from website contact form

Name: ${name}
Email: ${email}
Phone: ${phone}
Subject: ${subject}
Page: ${page}

Message:
${message}
`,
      html: `
        <h2>New website message</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${phone}</p>
        <p><strong>Subject:</strong> ${subject}</p>
        <p><strong>Page:</strong> ${page}</p>
        <hr/>
        <p>${(message || '').replace(/\n/g, '<br/>')}</p>
      `
    };

    await transporter.sendMail(mailOptions);

    return { statusCode: 200, headers: CORS_HEADERS, body: JSON.stringify({ ok: true }) };
  } catch (err) {
    console.error('Send email error', err);
    return { statusCode: 500, headers: CORS_HEADERS, body: JSON.stringify({ error: 'Failed to send email' }) };
  }
};