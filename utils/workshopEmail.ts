import nodemailer from "nodemailer";

type WorkshopEmailData = {
  participantName: string;
  email: string;
  workshopName: string;
  workshopDate?: string;
  workshopTime?: string;
  workshopLocation?: string;
  registrationCode: string;
};

async function sendWorkshopEmail({
  participantName,
  email,
  workshopName,
  workshopDate,
  workshopTime,
  workshopLocation,
  registrationCode,
  paymentMethod = "paypal",
}: WorkshopEmailData & { paymentMethod?: "paypal" | "cash" | "cash_deposit" | "cash_paid" }) {
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

  const isCash = paymentMethod === "cash";
  const isCashDeposit = paymentMethod === "cash_deposit";
  const isCashPaid = paymentMethod === "cash_paid";
  const text = [
    `Hello ${participantName},`,
    "",
    isCashDeposit || isCashPaid ? `Your place at the workshop ${workshopName} is confirmed.` : isCash ? `Your place at the workshop ${workshopName} has been reserved.` : `Your registration for the workshop ${workshopName} has been confirmed.`,
    `Registration Code: ${registrationCode}`,
    workshopDate ? `Date: ${workshopDate}` : "",
    workshopTime ? `Time: ${workshopTime}` : "",
    workshopLocation ? `Location: ${workshopLocation}` : "",
    isCashDeposit ? "Payment: we received your €10 PayPal reservation fee. It is deducted from the workshop price and helps us hold places fairly in case of no-shows. If your plans change, please let us know at least 48 hours before the workshop to request a refund. The remaining €15 is due on the workshop day." : isCashPaid ? "Payment: the remaining €15 was received on the workshop day." : isCash ? "Payment: a €10 PayPal reservation fee is required to confirm your place. It is deducted from the workshop price and helps us hold places fairly in case of no-shows. If your plans change, please let us know at least 48 hours before the workshop to request a refund. The remaining €15 is due on the workshop day." : "Payment: confirmed via PayPal.",
    "Please present this Registration Code on the day of the workshop.",
  ].filter(Boolean).join("\n");

  await transporter.sendMail({
    from: fromEmail,
    to: email,
    subject: isCashDeposit || isCashPaid ? `Workshop place confirmed - ${workshopName}` : isCash ? `Workshop reservation - ${workshopName}` : `Workshop registration confirmed - ${workshopName}`,
    text,
    html: `
      <div style="font-family:Arial,sans-serif; color:#111; line-height:1.6;">
        <h2>${isCashDeposit || isCashPaid ? "Workshop place confirmed" : isCash ? "Workshop reservation" : "Workshop registration confirmed"}</h2>
        <p>Hello <strong>${participantName}</strong>,</p>
        <p>${isCashDeposit || isCashPaid ? `Your place at <strong>${workshopName}</strong> is confirmed.` : isCash ? `Your place at <strong>${workshopName}</strong> has been reserved.` : `Your registration for <strong>${workshopName}</strong> has been confirmed.`}</p>
        <p><strong>Registration Code:</strong> ${registrationCode}</p>
        ${workshopDate ? `<p><strong>Date:</strong> ${workshopDate}</p>` : ""}
        ${workshopTime ? `<p><strong>Time:</strong> ${workshopTime}</p>` : ""}
        ${workshopLocation ? `<p><strong>Location:</strong> ${workshopLocation}</p>` : ""}
        <p><strong>Status:</strong> ${isCashDeposit ? "€10 PayPal reservation fee received and deducted from the workshop price; remaining €15 due on the workshop day. The reservation fee helps us hold places fairly in case of no-shows. Please let us know at least 48 hours before the workshop to request a refund." : isCashPaid ? "remaining €15 received on the workshop day." : isCash ? "reservation created; a €10 PayPal reservation fee is required to confirm the place. Please let us know at least 48 hours before the workshop to request a refund if your plans change." : "payment confirmed via PayPal."}</p>
        <p>Please present this Registration Code on the day of the workshop.</p>
      </div>
    `,
  });

  return { ok: true, skipped: false };
}

export function sendWorkshopConfirmationEmail(data: WorkshopEmailData & { paymentMethod?: "paypal" }) {
  return sendWorkshopEmail({ ...data, paymentMethod: data.paymentMethod || "paypal" });
}

export function sendWorkshopCashReservationEmail(data: WorkshopEmailData) {
  return sendWorkshopEmail({ ...data, paymentMethod: "cash" });
}

export function sendWorkshopCashDepositConfirmationEmail(data: WorkshopEmailData) {
  return sendWorkshopEmail({ ...data, paymentMethod: "cash_deposit" });
}

export function sendWorkshopCashBalancePaymentEmail(data: WorkshopEmailData) {
  return sendWorkshopEmail({ ...data, paymentMethod: "cash_paid" });
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
    text: `Hello ${data.participantName},\n\nRegistration ${data.registrationCode} for ${data.workshopName} has been cancelled.`,
  });

  return { ok: true, skipped: false };
}
