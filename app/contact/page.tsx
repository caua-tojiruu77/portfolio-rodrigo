"use client";
import ContactForm from "../../components/forms/ContactForm";
import { useLanguage } from "@/context/languageContext";
import { createPolyglot } from "@/utils/polyglot";

export default function ContactPage() {
  const { language } = useLanguage();
  const p = createPolyglot(language);

  return (
    <main style={{ padding: "48px 16px", display: "flex", justifyContent: "center", color: "#fff" }}>
      <section style={{ maxWidth: 900, width: "100%" }}>
        <h1 style={{ marginBottom: 12, color: "#fff" }}>{p.t("contact.title")}</h1>
        <p style={{ marginBottom: 18, color: "#fff" }}>{p.t("contact.description")}</p>
        <ContactForm />

        <div style={{ marginTop: 16, fontSize: 13, color: "#ddd" }}>
          <strong style={{ color: "#fff" }}>{p.t("privacy.heading")}</strong>
          <p style={{ marginTop: 6 }}>{p.t("privacy.body")}</p>
        </div>
      </section>
    </main>
  );
}
