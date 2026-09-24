import nodemailer from "nodemailer";

type WorkshopEmailData = {
  participantName: string;
  email: string;
  phone?: string;
  workshopName: string;
  workshopDate?: string;
  workshopTime?: string;
  workshopLocation?: string;
  workshopImage?: string;
  registrationCode: string;
  amount?: number;
  currency?: string;
  purchaseDate?: number;
};

type PaymentEmailOptions = WorkshopEmailData & {
  paymentMethod?: "paypal" | "cash" | "cash_deposit" | "cash_paid";
  notifyAdmin?: boolean;
  sendCustomer?: boolean;
  sendAdmin?: boolean;
  testMode?: boolean;
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

function getTransport() {
  const smtpHost = process.env.SMTP_HOST;
  const smtpPort = process.env.SMTP_PORT;
  const smtpUser = process.env.SMTP_USER;
  const smtpPass = process.env.SMTP_PASS;
  const fromEmail = process.env.FROM_EMAIL || smtpUser;

  if (!smtpHost || !smtpPort || !smtpUser || !smtpPass || !fromEmail) return null;

  return {
    fromEmail,
    transporter: nodemailer.createTransport({
      host: smtpHost,
      port: Number(smtpPort),
      secure: Number(smtpPort) === 465,
      auth: { user: smtpUser, pass: smtpPass },
    }),
  };
}

function buildTicketHtml(data: WorkshopEmailData, status: string, extraRows = "") {
  const baseUrl = (process.env.APP_URL || "https://meu-portfolio-v1-chi.vercel.app").replace(/\/$/, "");
  const imageUrl = data.workshopImage ? new URL(data.workshopImage, `${baseUrl}/`).toString() : "";
  const safe = escapeHtml;

  return `
    <div style="font-family:Arial,sans-serif;color:#17133b;line-height:1.5;max-width:640px;margin:0 auto;background:#fff;border:1px solid #dedbea;border-radius:18px;overflow:hidden;">
      ${imageUrl ? `<img src="${safe(imageUrl)}" alt="${safe(data.workshopName)}" width="640" style="display:block;width:100%;max-width:640px;height:auto;border:0;" />` : ""}
      <div style="padding:24px;background:#17133b;color:#fff;">
        <p style="margin:0 0 6px;color:#f4d35e;font-size:12px;letter-spacing:2px;text-transform:uppercase;">Workshop ticket</p>
        <h1 style="font-size:24px;line-height:1.25;margin:0;color:#fff;">${safe(data.workshopName)}</h1>
      </div>
      <div style="padding:24px;">
        <p style="margin:0 0 16px;">Hello <strong>${safe(data.participantName)}</strong>, your place is confirmed after payment.</p>
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border-collapse:collapse;">
          ${data.workshopDate ? `<tr><td style="padding:8px 0;border-bottom:1px solid #eee;color:#666;width:35%;">Date / time</td><td style="padding:8px 0;border-bottom:1px solid #eee;">${safe(data.workshopDate)}${data.workshopTime ? ` · ${safe(data.workshopTime)}` : ""}</td></tr>` : ""}
          ${data.workshopLocation ? `<tr><td style="padding:8px 0;border-bottom:1px solid #eee;color:#666;">Location</td><td style="padding:8px 0;border-bottom:1px solid #eee;white-space:pre-line;">${safe(data.workshopLocation)}</td></tr>` : ""}
          <tr><td style="padding:8px 0;border-bottom:1px solid #eee;color:#666;">Participant</td><td style="padding:8px 0;border-bottom:1px solid #eee;">${safe(data.participantName)}</td></tr>
          <tr><td style="padding:8px 0;border-bottom:1px solid #eee;color:#666;">Booking code</td><td style="padding:8px 0;border-bottom:1px solid #eee;font-family:monospace;font-size:18px;font-weight:bold;letter-spacing:2px;">${safe(data.registrationCode)}</td></tr>
          <tr><td style="padding:8px 0;color:#666;">Payment status</td><td style="padding:8px 0;font-weight:bold;">${safe(status)}</td></tr>
          ${extraRows}
        </table>
        <p style="margin:20px 0 0;color:#666;font-size:13px;">Keep this email or print it and bring it to the workshop.</p>
      </div>
    </div>`;
}

async function sendWorkshopEmail({
  participantName,
  email,
  phone,
  workshopName,
  workshopDate,
  workshopTime,
  workshopLocation,
  workshopImage,
  registrationCode,
  amount,
  currency = "EUR",
  purchaseDate = Date.now(),
  paymentMethod = "paypal",
  notifyAdmin = true,
  sendCustomer = true,
  sendAdmin = true,
  testMode = false,
}: PaymentEmailOptions) {
  const mail = getTransport();
  if (!mail) return { ok: true, skipped: true, customerSent: false, adminSent: false };

  const data = { participantName, email, phone, workshopName, workshopDate, workshopTime, workshopLocation, workshopImage, registrationCode };
  const isCashDeposit = paymentMethod === "cash_deposit";
  const isCashPaid = paymentMethod === "cash_paid";
  const paymentStatus = testMode
    ? "TEST PREVIEW · no payment was made"
    : isCashDeposit
    ? "€10 reservation fee paid · €15 due on the workshop day"
    : isCashPaid
      ? "Paid"
      : "Paid via PayPal";
  const customerText = [
    `Hello ${participantName},`,
    testMode ? "This is a preview of the workshop ticket. No reservation or payment was created." : `Your place at ${workshopName} is confirmed after payment.`,
    `Registration code: ${registrationCode}`,
    workshopDate ? `Date / time: ${workshopDate}${workshopTime ? ` · ${workshopTime}` : ""}` : "",
    workshopLocation ? `Location: ${workshopLocation}` : "",
    `Payment status: ${paymentStatus}`,
    "Keep this email or print it and bring it to the workshop.",
  ].filter(Boolean).join("\n");

  let customerSent = false;
  let adminSent = false;

  if (sendCustomer) {
    try {
      await mail.transporter.sendMail({
        from: mail.fromEmail,
        to: email,
        subject: `${testMode ? "[TEST] Workshop ticket preview" : "Workshop ticket confirmed"} - ${workshopName}`,
        text: customerText,
        html: buildTicketHtml(data, paymentStatus),
      });
      customerSent = true;
    } catch (error) {
      console.error("Workshop customer confirmation email could not be sent:", error);
    }
  }

  if (notifyAdmin && sendAdmin) {
    try {
      const dateText = new Date(purchaseDate).toLocaleString("en-GB", { timeZone: "Europe/Berlin" });
      const amountText = amount === undefined ? "" : new Intl.NumberFormat("en", { style: "currency", currency }).format(amount);
      const adminRows = [
        `<tr><td style="padding:8px 0;border-bottom:1px solid #eee;color:#666;">Customer email</td><td style="padding:8px 0;border-bottom:1px solid #eee;">${escapeHtml(email)}</td></tr>`,
        phone ? `<tr><td style="padding:8px 0;border-bottom:1px solid #eee;color:#666;">Phone</td><td style="padding:8px 0;border-bottom:1px solid #eee;">${escapeHtml(phone)}</td></tr>` : "",
        `<tr><td style="padding:8px 0;border-bottom:1px solid #eee;color:#666;">Purchase date</td><td style="padding:8px 0;border-bottom:1px solid #eee;">${escapeHtml(dateText)}</td></tr>`,
        amountText ? `<tr><td style="padding:8px 0;color:#666;">Amount paid</td><td style="padding:8px 0;">${escapeHtml(amountText)}</td></tr>` : "",
      ].filter(Boolean).join("");
      const adminText = [
        "A workshop payment has been confirmed.",
        `Workshop: ${workshopName}`,
        `Name: ${participantName}`,
        `Email: ${email}`,
        phone ? `Phone: ${phone}` : "",
        `Registration code: ${registrationCode}`,
        `Purchase date: ${dateText}`,
        amountText ? `Amount paid: ${amountText}` : "",
        `Payment status: ${paymentStatus}`,
      ].filter(Boolean).join("\n");

      await mail.transporter.sendMail({
        from: mail.fromEmail,
        to: "rodrigo.tavella@gmail.com",
        subject: `Workshop payment confirmed: ${workshopName}`,
        text: adminText,
        html: buildTicketHtml(data, paymentStatus, adminRows),
      });
      adminSent = true;
    } catch (error) {
      console.error("Workshop administrator notification email could not be sent:", error);
    }
  }

  return { ok: true, skipped: false, customerSent, adminSent };
}

export function sendWorkshopConfirmationEmail(data: WorkshopEmailData & { paymentMethod?: "paypal"; sendCustomer?: boolean; sendAdmin?: boolean }) {
  return sendWorkshopEmail({ ...data, paymentMethod: data.paymentMethod || "paypal" });
}

export function sendWorkshopCashDepositConfirmationEmail(data: WorkshopEmailData & { sendCustomer?: boolean; sendAdmin?: boolean }) {
  return sendWorkshopEmail({ ...data, paymentMethod: "cash_deposit" });
}

export function sendWorkshopCashBalancePaymentEmail(data: WorkshopEmailData) {
  return sendWorkshopEmail({ ...data, paymentMethod: "cash_paid", notifyAdmin: false });
}

export function sendWorkshopEmailPreview(data: WorkshopEmailData) {
  return sendWorkshopEmail({ ...data, paymentMethod: "paypal", notifyAdmin: false, testMode: true });
}

export async function sendWorkshopCancellationEmail(data: WorkshopEmailData) {
  const mail = getTransport();
  if (!mail) return { ok: true, skipped: true };

  await mail.transporter.sendMail({
    from: mail.fromEmail,
    to: data.email,
    subject: `Workshop registration cancelled - ${data.workshopName}`,
    text: `Hello ${data.participantName},\n\nRegistration ${data.registrationCode} for ${data.workshopName} has been cancelled. Cancellations made at least 48 hours before the workshop are eligible for a refund. To request a refund, contact Rodrigo through the website using any of the available contact options.`,
  });

  return { ok: true, skipped: false };
}
