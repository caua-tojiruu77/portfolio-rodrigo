import { NextResponse } from "next/server";
import { createPolyglot } from "@/utils/polyglot";

// Contact messages are always delivered to the workshop owner. Keeping this
// independent from SMTP credentials prevents a previous deploy's TO_EMAIL
// setting from redirecting messages to a developer mailbox.
const CONTACT_RECIPIENT = "rodrigo.tavella@gmail.com";

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const p = createPolyglot(body.language || "en");
    const isValidEmail = (email: unknown): email is string =>
      typeof email === "string" && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

    if (!isValidEmail(CONTACT_RECIPIENT)) {
      return NextResponse.json({ ok: false, error: "Contact recipient is not configured correctly." }, { status: 500 });
    }

    const smtpHost = process.env.SMTP_HOST;
    const smtpPort = process.env.SMTP_PORT;
    const smtpUser = process.env.SMTP_USER;
    const smtpPass = process.env.SMTP_PASS;

    if (smtpHost && smtpPort && smtpUser && smtpPass) {
      const nodemailer = await import("nodemailer");
      const transporter = nodemailer.createTransport({
        host: smtpHost,
        port: Number(smtpPort),
        secure: Number(smtpPort) === 465,
        auth: { user: smtpUser, pass: smtpPass },
      });

      const labels = {
        nome: "First name",
        sobrenome: "Last name",
        telefone: "Phone number",
        email: "Email",
        mensagem: "Message",
      };
      const nome = String(body.nome || "");
      const sobrenome = String(body.sobrenome || "");
      const telefone = String(body.telefone || "");
      const email = isValidEmail(body.email) ? body.email : "";
      const mensagem = String(body.mensagem || "");
      const subject = "New message from your website";
      const text = `${labels.nome}: ${nome}\n${labels.sobrenome}: ${sobrenome}\n${labels.telefone}: ${telefone}\n${labels.email}: ${email}\n\n${labels.mensagem}:\n${mensagem}`;
      const escapeHtml = (value: string) => value.replace(/[&<>"']/g, (character) => ({
        "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
      })[character]!);
      const fromEmail = process.env.FROM_EMAIL || smtpUser;

      await transporter.sendMail({
        from: fromEmail,
        to: CONTACT_RECIPIENT,
        replyTo: email || undefined,
        subject,
        text,
        html: `<div style="font-family:Arial,sans-serif;color:#111;line-height:1.4"><h2>${escapeHtml(subject)}</h2><p><strong>${escapeHtml(labels.nome)}:</strong> ${escapeHtml(nome)}</p><p><strong>${escapeHtml(labels.sobrenome)}:</strong> ${escapeHtml(sobrenome)}</p><p><strong>${escapeHtml(labels.telefone)}:</strong> ${escapeHtml(telefone)}</p><p><strong>${escapeHtml(labels.email)}:</strong> ${escapeHtml(email)}</p><p><strong>${escapeHtml(labels.mensagem)}:</strong></p><p style="white-space:pre-wrap">${escapeHtml(mensagem)}</p><p>Sent from the website contact form</p></div>`,
      });
      return NextResponse.json({ ok: true, message: p.t("success") });
    }

    const formEndpoint = process.env.FORMSPREE_ENDPOINT || process.env.NEXT_PUBLIC_FORMSPREE_ENDPOINT;
    if (formEndpoint) {
      const params = new URLSearchParams();
      params.append("_to", CONTACT_RECIPIENT);
      params.append("_replyto", isValidEmail(body.email) ? body.email : "");
      params.append("nome", String(body.nome || ""));
      params.append("sobrenome", String(body.sobrenome || ""));
      params.append("telefone", String(body.telefone || ""));
      params.append("email", isValidEmail(body.email) ? body.email : "");
      params.append("mensagem", String(body.mensagem || ""));

      const response = await fetch(formEndpoint, {
        method: "POST",
        headers: { Accept: "application/json" },
        body: params,
      });
      const data = await response.json().catch(() => ({}));
      if (response.ok) return NextResponse.json({ ok: true, message: p.t("success") });
      return NextResponse.json({ ok: false, error: data?.error || "Erro ao encaminhar a mensagem" }, { status: response.status });
    }

    return NextResponse.json({ ok: false, error: "Contact email delivery is not configured." }, { status: 503 });
  } catch {
    return NextResponse.json({ ok: false, error: "Erro interno no servidor." }, { status: 500 });
  }
}
