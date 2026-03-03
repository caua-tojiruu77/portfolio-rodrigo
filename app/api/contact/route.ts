import { NextResponse } from "next/server";
import { createPolyglot } from "@/utils/polyglot";

// Nota: para envio por e-mail diretamente, defina as variáveis de ambiente abaixo em `.env.local`:
// SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, TO_EMAIL
// Se essas variáveis não estiverem definidas, a rota encaminhará para FORMSPREE_ENDPOINT quando configurado.

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));

    const smtpHost = process.env.SMTP_HOST;
    const smtpPort = process.env.SMTP_PORT;
    const smtpUser = process.env.SMTP_USER;
    const smtpPass = process.env.SMTP_PASS;
    const configuredToEmail = process.env.TO_EMAIL;
    const p = createPolyglot(body.language || "it");
    // Prefer the email submitted in the form when it's a valid-looking address.
    const isValidEmail = (e: any) => typeof e === "string" && /\S+@\S+\.\S+/.test(e);
    const recipientEmail = isValidEmail(body.email) ? body.email : configuredToEmail;

    // If SMTP is configured, send email directly using nodemailer
    // Proceed when SMTP credentials exist and we have either a configured site owner or a valid form recipient
    const hasRecipient = isValidEmail(body.email) || Boolean(configuredToEmail);
    if (smtpHost && smtpPort && smtpUser && smtpPass && hasRecipient) {
      // lazy-load nodemailer to avoid adding overhead to client bundles
      const nodemailer = await import("nodemailer");

      const transporter = nodemailer.createTransport({
        host: smtpHost,
        port: Number(smtpPort),
        secure: Number(smtpPort) === 465, // true for 465, false for other ports
        auth: { user: smtpUser, pass: smtpPass },
      });

        // Use fixed subject requested by user
        const subject = "Interesse eu seu trabalho";

        // Prepare localized labels when language is provided
        const lang = body.language || "it";
        const p = createPolyglot(lang);

        const labels = {
          nome: p.t("contact.nome"),
          sobrenome: p.t("contact.sobrenome"),
          telefone: p.t("contact.telefone"),
          email: p.t("contact.email"),
          mensagem: p.t("contact.mensagem"),
        };

        const text = `${labels.nome}: ${body.nome || ""}\n${labels.sobrenome}: ${body.sobrenome || ""}\n${labels.telefone}: ${body.telefone || ""}\n${labels.email}: ${body.email || ""}\n\n${labels.mensagem}:\n${body.mensagem || ""}`;

        const html = `
          <div style="font-family: Arial, Helvetica, sans-serif; color: #111; line-height:1.4;">
            <h2 style="background:#111;color:#fff;padding:10px;border-radius:6px;">${subject}</h2>
            <table style="width:100%;border-collapse:collapse;margin-top:12px;">
              <tbody>
                <tr><td style="font-weight:600;padding:6px 8px;border:1px solid #eee;width:160px;">${labels.nome}</td><td style="padding:6px 8px;border:1px solid #eee;">${body.nome || ""}</td></tr>
                <tr><td style="font-weight:600;padding:6px 8px;border:1px solid #eee;">${labels.sobrenome}</td><td style="padding:6px 8px;border:1px solid #eee;">${body.sobrenome || ""}</td></tr>
                <tr><td style="font-weight:600;padding:6px 8px;border:1px solid #eee;">${labels.telefone}</td><td style="padding:6px 8px;border:1px solid #eee;">${body.telefone || ""}</td></tr>
                <tr><td style="font-weight:600;padding:6px 8px;border:1px solid #eee;">${labels.email}</td><td style="padding:6px 8px;border:1px solid #eee;">${body.email || ""}</td></tr>
              </tbody>
            </table>
            <div style="margin-top:12px;padding:10px;border:1px solid #eee;border-radius:6px;background:#fafafa;">
              <strong>${labels.mensagem}:</strong>
              <div style="margin-top:8px;white-space:pre-wrap;">${(body.mensagem || "").replace(/</g, '&lt;').replace(/>/g, '&gt;')}</div>
            </div>
            <p style="color:#666;font-size:12px;margin-top:10px">Enviado do formulário do site</p>
          </div>
        `;

      const fromEmail = process.env.FROM_EMAIL || smtpUser;

      const mailOptions: any = {
        from: fromEmail,
        to: recipientEmail,
        subject,
        text,
      };

      // If the recipient is the submitter (body.email) and we also have a configured site owner,
      // add the site owner as CC so they receive a copy. (This is optional but useful.)
      if (isValidEmail(body.email) && configuredToEmail && configuredToEmail !== body.email) {
        mailOptions.cc = configuredToEmail;
        // set replyTo to site owner so replies go to the owner
        mailOptions.replyTo = configuredToEmail;
      } else {
        mailOptions.replyTo = body.email || undefined;
      }

      // include html version
      mailOptions.html = html;
      const info = await transporter.sendMail(mailOptions);

      return NextResponse.json({ ok: true, message: p.t("success") });
    }

    // Fallback: forward to Formspree if configured
    const formEndpoint = process.env.FORMSPREE_ENDPOINT || process.env.NEXT_PUBLIC_FORMSPREE_ENDPOINT;
    if (formEndpoint) {
      const params = new URLSearchParams();
      params.append("nome", body.nome || "");
      params.append("sobrenome", body.sobrenome || "");
      params.append("telefone", body.telefone || "");
      params.append("email", body.email || "");
      params.append("mensagem", body.mensagem || "");

      const res = await fetch(formEndpoint, {
        method: "POST",
        headers: { Accept: "application/json" },
        body: params,
      });

      const data = await res.json().catch(() => ({}));

      if (res.ok) return NextResponse.json({ ok: true, message: p.t("success") });

      return NextResponse.json({ ok: false, error: data?.error || "Erro ao encaminhar a mensagem" }, { status: res.status });
    }

    // No delivery configured: allow local testing by returning success.
    return NextResponse.json({ ok: true, message: p.t("success") });
  } catch (err) {
    return NextResponse.json({ ok: false, error: "Erro interno no servidor." }, { status: 500 });
  }
}
