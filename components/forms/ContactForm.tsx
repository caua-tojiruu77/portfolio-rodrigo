"use client"
import React, { useState } from "react";
import { useLanguage } from "@/context/languageContext";
import { createPolyglot } from "@/utils/polyglot";

type FormState = {
  nome: string;
  sobrenome: string;
  telefone: string;
  email: string;
  mensagem: string;
};

export default function ContactForm() {
  const { language } = useLanguage();
  const polyglot = createPolyglot(language);
  const [form, setForm] = useState<FormState>({
    nome: "",
    sobrenome: "",
    telefone: "",
    email: "",
    mensagem: "",
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const { name, value } = e.target;
    setForm((s) => ({ ...s, [name]: value }));
  }

  function validate() {
    if (!form.nome.trim() || !form.sobrenome.trim()) return polyglot.t("contact.validation.nomeSobrenome");
    if (!form.email.trim()) return polyglot.t("contact.validation.email");
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(form.email)) return polyglot.t("contact.validation.emailInvalid");
    if (!form.mensagem.trim()) return polyglot.t("contact.validation.mensagem");
    return null;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    const v = validate();
    if (v) {
      setError(v);
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({ ...form, language }),
      });

      const data = await res.json().catch(() => ({}));

      if (res.ok) {
        setSuccess(data.message || "Mensagem enviada com sucesso. Obrigado!");
        setForm({ nome: "", sobrenome: "", telefone: "", email: "", mensagem: "" });
      } else {
        setError(data.error || data.message || "Erro ao enviar a mensagem.");
      }
    } catch (err) {
      setError("Erro de rede ao enviar a mensagem.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} aria-label="Formulário de contato" style={{ maxWidth: 720 }}>
      <div style={{ display: "grid", gap: 12, color: "#fff" }}>
        <div style={{ display: "flex", gap: 12 }}>
          <div style={{ flex: 1 }}>
            <label style={{ display: "block", fontSize: 14, marginBottom: 6, color: "#fff" }}>{polyglot.t("contact.nome")}</label>
            <input name="nome" value={form.nome} onChange={handleChange} required style={{ width: "100%", padding: 10, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.12)", color: "#fff" }} />
          </div>
          <div style={{ flex: 1 }}>
            <label style={{ display: "block", fontSize: 14, marginBottom: 6, color: "#fff" }}>{polyglot.t("contact.sobrenome")}</label>
            <input name="sobrenome" value={form.sobrenome} onChange={handleChange} required style={{ width: "100%", padding: 10, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.12)", color: "#fff" }} />
          </div>
        </div>

        <div style={{ display: "flex", gap: 12 }}>
          <div style={{ flex: 1 }}>
            <label style={{ display: "block", fontSize: 14, marginBottom: 6, color: "#fff" }}>{polyglot.t("contact.telefone")}</label>
            <input name="telefone" value={form.telefone} onChange={handleChange} style={{ width: "100%", padding: 10, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.12)", color: "#fff" }} />
          </div>
          <div style={{ flex: 1 }}>
            <label style={{ display: "block", fontSize: 14, marginBottom: 6, color: "#fff" }}>{polyglot.t("contact.email")}</label>
            <input name="email" value={form.email} onChange={handleChange} required style={{ width: "100%", padding: 10, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.12)", color: "#fff" }} />
          </div>
        </div>

        <div>
          <label style={{ display: "block", fontSize: 14, marginBottom: 6, color: "#fff" }}>{polyglot.t("contact.mensagem")}</label>
          <textarea name="mensagem" value={form.mensagem} onChange={handleChange} required style={{ width: "100%", minHeight: 140, padding: 10, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.12)", color: "#fff" }} />
        </div>

        {error && <div style={{ color: "#ff8a80" }}>{error}</div>}
        {success && <div style={{ color: "#90ee90" }}>{success}</div>}

        <div>
          <button type="submit" disabled={loading} style={{ padding: "10px 16px", background: "#ffffff10", color: "#fff", border: "1px solid rgba(255,255,255,0.12)" }}>
            {loading ? polyglot.t("contact.sending") : polyglot.t("contact.submit")}
          </button>
        </div>
      </div>
    </form>
  );
}
