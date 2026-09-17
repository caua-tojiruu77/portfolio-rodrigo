import nodemailer from "nodemailer";

export async function sendWorkshopConfirmationEmail({
  participantName,
  email,
  workshopName,
  workshopDate,
  workshopTime,
  workshopLocation,
  registrationId,
}: {
  participantName: string;
  email: string;
  workshopName: string;
  workshopDate?: string;
  workshopTime?: string;
  workshopLocation?: string;
  registrationId: string;
}) {
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

  const text = [
    `Olá ${participantName},`,
    "",
    `Sua inscrição no workshop ${workshopName} foi confirmada.`,
    `ID da inscrição: ${registrationId}`,
    workshopDate ? `Data: ${workshopDate}` : "",
    workshopTime ? `Horário: ${workshopTime}` : "",
    workshopLocation ? `Local: ${workshopLocation}` : "",
    "Pagamento aprovado.",
  ].filter(Boolean).join("\n");

  await transporter.sendMail({
    from: fromEmail,
    to: email,
    subject: `Confirmação de inscrição - ${workshopName}`,
    text,
    html: `
      <div style="font-family:Arial,sans-serif; color:#111; line-height:1.6;">
        <h2>Confirmação de inscrição</h2>
        <p>Olá <strong>${participantName}</strong>,</p>
        <p>Sua inscrição no workshop <strong>${workshopName}</strong> foi confirmada.</p>
        <p><strong>ID da inscrição:</strong> ${registrationId}</p>
        ${workshopDate ? `<p><strong>Data:</strong> ${workshopDate}</p>` : ""}
        ${workshopTime ? `<p><strong>Horário:</strong> ${workshopTime}</p>` : ""}
        ${workshopLocation ? `<p><strong>Local:</strong> ${workshopLocation}</p>` : ""}
        <p><strong>Status:</strong> pagamento aprovado.</p>
      </div>
    `,
  });

  return { ok: true, skipped: false };
}
