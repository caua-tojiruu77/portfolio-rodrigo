import nodemailer from "nodemailer";

type WorkshopEmailData = {
  participantName: string;
  email: string;
  phone?: string;
  workshopName: string;
  workshopDate?: string;
  workshopTime?: string;
  workshopLocation?: string;
  registrationCode: string;
};

function escapeHtml(value: string) {
  const replacements: Record<string, string> = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;",
  };
  return value.replace(/[&<>"']/g, (character) => replacements[character]);
}

async function sendWorkshopEmail({
  participantName,
  email,
  phone,
  workshopName,
  workshopDate,
  workshopTime,
  workshopLocation,
  registrationCode,
  paymentMethod = "paypal",
  notifyAdmin = true,
}: WorkshopEmailData & { paymentMethod?: "paypal" | "cash" | "cash_deposit" | "cash_paid"; notifyAdmin?: boolean }) {
  const smtpHost = process.env.SMTP_HOST;
  const smtpPort = process.env.SMTP_PORT;
  const smtpUser = process.env.SMTP_USER;
  const smtpPass = process.env.SMTP_PASS;
  const fromEmail = process.env.FROM_EMAIL || smtpUser;
  // This is the owner notification for a new workshop registration. It must
  // not depend on a legacy TO_EMAIL or a developer mailbox configured in an
  // environment variable.
  const notificationEmail = "rodrigo.tavella@gmail.com";

  if (!smtpHost || !smtpPort || !smtpUser || !smtpPass || !fromEmail) {
    return { ok: true, skipped: true };
  }

  const transporter = nodemailer.createTransport({
    host: smtpHost,
    port: Number(smtpPort),
    secure: Number(smtpPort) === 465,
    auth: { user: smtpUser, pass: smtpPass },
  });

  const isCash = paymentMethod === "cash";
  const isCashDeposit = paymentMethod === "cash_deposit";
  const isCashPaid = paymentMethod === "cash_paid";
  const text = [
    "✨ ⭐ ✨",
    `Hello ${participantName},`,
    "",
    isCashDeposit || isCashPaid ? `Your place at the workshop ${workshopName} is confirmed.` : isCash ? `Your place at the workshop ${workshopName} has been reserved.` : `Your registration for the workshop ${workshopName} has been confirmed.`,
    `Registration Code: ${registrationCode}`,
    workshopDate ? `Date & time: ${workshopDate}` : "",
    workshopTime ? `Time: ${workshopTime}` : "",
    workshopLocation ? `Location: ${workshopLocation}` : "",
    isCashDeposit ? "Payment: we received your €10 PayPal reservation fee. It is deducted from the workshop price and helps us hold places fairly in case of no-shows. If your plans change, please contact Rodrigo through the website using any of the available contact options at least 48 hours before the workshop to request a refund. The remaining €15 is due on the workshop day." : isCashPaid ? "Payment: the remaining €15 was received on the workshop day." : isCash ? "Payment: a €10 PayPal reservation fee is required to confirm your place. It is deducted from the workshop price and helps us hold places fairly in case of no-shows. If your plans change, please contact Rodrigo through the website using any of the available contact options at least 48 hours before the workshop to request a refund. The remaining €15 is due on the workshop day." : "Payment: confirmed via PayPal.",
    "Please present this Registration Code on the day of the workshop.",
    "💃 🩰 Keep moving. Keep shining! ✨",
  ].filter(Boolean).join("\n");

  await transporter.sendMail({
    from: fromEmail,
    to: email,
    subject: isCashDeposit || isCashPaid ? `Workshop place confirmed - ${workshopName}` : isCash ? `Workshop reservation - ${workshopName}` : `Workshop registration confirmed - ${workshopName}`,
    text,
    html: `
      <div style="font-family:Arial,sans-serif; color:#111; line-height:1.6;">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border-collapse:collapse; background:#17133b; border-radius:16px; color:#fff;">
          <tr><td style="padding:28px 24px; text-align:center; background:#211b52; border-radius:16px 16px 0 0;">
            <div style="font-size:25px; letter-spacing:4px; color:#f4d35e;">✦ ✨ ✦</div>
            <h1 style="margin:10px 0 4px; font-size:24px; color:#fff;">${isCashDeposit || isCashPaid ? "Your place is confirmed" : isCash ? "Your workshop place is reserved" : "Your registration is confirmed"}</h1>
            <p style="margin:0; color:#e9dcff;">A little balance, a lot of courage, and room to move. 💃</p>
          </td></tr>
          <tr><td style="padding:24px;">
        <p>Hello <strong>${participantName}</strong>,</p>
        <p>${isCashDeposit || isCashPaid ? `Your place at <strong>${workshopName}</strong> is confirmed.` : isCash ? `Your place at <strong>${workshopName}</strong> has been reserved.` : `Your registration for <strong>${workshopName}</strong> has been confirmed.`}</p>
        <p><strong>Registration Code:</strong> ${registrationCode}</p>
        ${workshopDate ? `<p><strong>Date &amp; time:</strong> ${workshopDate}</p>` : ""}
        ${workshopTime ? `<p><strong>Time:</strong> ${workshopTime}</p>` : ""}
        ${workshopLocation ? `<p><strong>Location:</strong> ${workshopLocation}</p>` : ""}
        <p><strong>Status:</strong> ${isCashDeposit ? "€10 PayPal reservation fee received and deducted from the workshop price; remaining €15 due on the workshop day. The reservation fee helps us hold places fairly in case of no-shows. If your plans change, contact Rodrigo through the website using any of the available contact options at least 48 hours before the workshop to request a refund." : isCashPaid ? "remaining €15 received on the workshop day." : isCash ? "reservation created; a €10 PayPal reservation fee is required to confirm the place. If your plans change, contact Rodrigo through the website using any of the available contact options at least 48 hours before the workshop to request a refund." : "payment confirmed via PayPal."}</p>
        <p>Please present this Registration Code on the day of the workshop.</p>
          </td></tr>
          <tr><td style="padding:16px 24px; text-align:center; color:#f4d35e; border-top:1px solid #4a437b;">Keep moving. Keep shining. ✨⭐🩰</td></tr>
        </table>
      </div>
    `,
  });

  if (notificationEmail && notifyAdmin) {
    // Admin notices are separate and contain only the new registration details.
    try {
      await transporter.sendMail({
        from: fromEmail,
        to: notificationEmail,
        subject: `New workshop registration: ${workshopName}`,
        text: [
          "A new participant registered for your workshop.",
          `Workshop: ${workshopName}`,
          `Name: ${participantName}`,
          `Email: ${email}`,
          phone ? `Phone: ${phone}` : "",
          `Registration code: ${registrationCode}`,
        ].filter(Boolean).join("\n"),
        html: `<div style="font-family:Arial,sans-serif;line-height:1.6;color:#17133b"><h2>New workshop registration</h2><p><strong>Workshop:</strong> ${escapeHtml(workshopName)}</p><p><strong>Name:</strong> ${escapeHtml(participantName)}</p><p><strong>Email:</strong> ${escapeHtml(email)}</p>${phone ? `<p><strong>Phone:</strong> ${escapeHtml(phone)}</p>` : ""}<p><strong>Registration code:</strong> ${escapeHtml(registrationCode)}</p></div>`,
      });
    } catch (error) {
      console.error("Workshop registration notification email could not be sent.");
    }
  }

  return { ok: true, skipped: false };
}

export function sendWorkshopConfirmationEmail(data: WorkshopEmailData & { paymentMethod?: "paypal" }) {
  return sendWorkshopEmail({ ...data, paymentMethod: data.paymentMethod || "paypal" });
}

export function sendWorkshopCashReservationEmail(data: WorkshopEmailData) {
  return sendWorkshopEmail({ ...data, paymentMethod: "cash" });
}

export function sendWorkshopCashDepositConfirmationEmail(data: WorkshopEmailData) {
  return sendWorkshopEmail({ ...data, paymentMethod: "cash_deposit", notifyAdmin: false });
}

export function sendWorkshopCashBalancePaymentEmail(data: WorkshopEmailData) {
  return sendWorkshopEmail({ ...data, paymentMethod: "cash_paid", notifyAdmin: false });
}

export async function sendWorkshopCancellationEmail(data: WorkshopEmailData) {
  const smtpHost = process.env.SMTP_HOST;
  const smtpPort = process.env.SMTP_PORT;
  const smtpUser = process.env.SMTP_USER;
  const smtpPass = process.env.SMTP_PASS;
  const fromEmail = process.env.FROM_EMAIL || smtpUser;

  if (!smtpHost || !smtpPort || !smtpUser || !smtpPass || !fromEmail) {
    return { ok: true, skipped: true };
  }

  const transporter = nodemailer.createTransport({
    host: smtpHost,
    port: Number(smtpPort),
    secure: Number(smtpPort) === 465,
    auth: { user: smtpUser, pass: smtpPass },
  });

  await transporter.sendMail({
    from: fromEmail,
    to: data.email,
    subject: `Workshop registration cancelled - ${data.workshopName}`,
    text: `Hello ${data.participantName},\n\nRegistration ${data.registrationCode} for ${data.workshopName} has been cancelled. Cancellations made at least 48 hours before the workshop are eligible for a refund. To request a refund, contact Rodrigo through the website using any of the available contact options.`,
  });

  return { ok: true, skipped: false };
}
