const fs = require('fs');
const path = require('path');

function parseDotEnv(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const lines = content.split(/\r?\n/);
  const env = {};
  for (let line of lines) {
    line = line.trim();
    if (!line || line.startsWith('#')) continue;
    const eq = line.indexOf('=');
    if (eq === -1) continue;
    const key = line.slice(0, eq).trim();
    let val = line.slice(eq + 1).trim();
    // remove optional surrounding quotes
    if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
      val = val.slice(1, -1);
    }
    env[key] = val;
  }
  return env;
}

async function main() {
  try {
    const envPath = path.join(__dirname, '..', '.env.local');
    if (!fs.existsSync(envPath)) {
      console.error('.env.local not found at', envPath);
      process.exit(1);
    }

    const env = parseDotEnv(envPath);
    const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, FROM_EMAIL, TO_EMAIL } = env;
    if (!SMTP_HOST || !SMTP_PORT || !SMTP_USER || !SMTP_PASS) {
      console.error('SMTP credentials missing in .env.local');
      process.exit(1);
    }

    const nodemailer = require('nodemailer');

    const transporter = nodemailer.createTransport({
      host: SMTP_HOST,
      port: Number(SMTP_PORT),
      secure: Number(SMTP_PORT) === 465,
      auth: { user: SMTP_USER, pass: SMTP_PASS },
    });

    const from = FROM_EMAIL || SMTP_USER;
    const to = TO_EMAIL || FROM_EMAIL || SMTP_USER;

    console.log('Sending test email from', from, 'to', to, 'via', SMTP_HOST);

    const info = await transporter.sendMail({
      from,
      to,
      subject: 'Test email from portfolio site (automated)',
      text: 'Hello — this is a test email sent from the local dev environment to verify SMTP settings.',
    });

    console.log('Message sent:', info && (info.messageId || info.response) || info);
  } catch (err) {
    console.error('Error sending test email:', err);
    process.exit(1);
  }
}

main();
