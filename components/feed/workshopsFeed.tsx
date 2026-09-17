"use client";

import Image from "next/image";
import { ArrowRight, CalendarDays, Clock3, MapPin, X } from "lucide-react";
import { useEffect, useState } from "react";
import { createPolyglot } from "@/utils/polyglot";
import { enabledWorkshops, getWorkshopContent, type Workshop } from "@/utils/workshops";
import { useLanguage } from "@/context/languageContext";

type RegistrationState = {
  id: string;
  workshopId: string;
  participantName: string;
  email: string;
  phone: string;
  reservationExpiresAt: number;
  status: string;
};

export default function WorkshopsFeed() {
  const { language } = useLanguage();
  const polyglot = createPolyglot(language);
  const [selectedWorkshop, setSelectedWorkshop] = useState<Workshop | null>(null);
  const [formData, setFormData] = useState({ participantName: "", email: "", phone: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [reservation, setReservation] = useState<RegistrationState | null>(null);
  const [error, setError] = useState("");

  const [liveMetrics, setLiveMetrics] = useState<Record<string, { availableSlots: number; isFull: boolean }>>({});

  useEffect(() => {
    const loadMetrics = async () => {
      const response = await fetch("/api/workshops");
      if (!response.ok) return;

      const data = await response.json();
      const nextState = Object.fromEntries(
        (data.workshops || []).map((workshop: any) => [workshop.id, {
          availableSlots: workshop.availableSlots,
          isFull: workshop.isFull,
        }]),
      );

      setLiveMetrics(nextState);
    };

    void loadMetrics();
  }, []);

  if (!enabledWorkshops.length) {
    return null;
  }

  const openRegister = (workshop: Workshop) => {
    setSelectedWorkshop(workshop);
    setFormData({ participantName: "", email: "", phone: "" });
    setReservation(null);
    setError("");
  };

  const closeDialog = () => {
    setSelectedWorkshop(null);
    setFormData({ participantName: "", email: "", phone: "" });
    setReservation(null);
    setError("");
  };

  const handleRegistrationSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!selectedWorkshop) return;

    setIsSubmitting(true);
    setError("");

    try {
      const response = await fetch(`/api/workshops/${selectedWorkshop.id}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          participantName: formData.participantName,
          email: formData.email,
          phone: formData.phone,
        }),
      });

      const data = await response.json();
      if (!response.ok || !data.ok) {
        throw new Error(data.error || "Não foi possível reservar a vaga.");
      }

      setReservation(data.registration);
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Erro ao reservar a vaga.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleContinueToPayment = async () => {
    if (!selectedWorkshop || !reservation) return;

    const response = await fetch("/api/paypal/create-order", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        workshopId: selectedWorkshop.id,
        registrationId: reservation.id,
      }),
    });

    const data = await response.json();
    if (!response.ok || !data.ok) {
      setError(data.error || "Não foi possível iniciar o pagamento.");
      return;
    }

    sessionStorage.setItem("workshopRegistration", JSON.stringify({
      workshopId: selectedWorkshop.id,
      registrationId: reservation.id,
      orderId: data.orderId,
      amount: selectedWorkshop.amount,
      currency: selectedWorkshop.currency,
    }));

    window.location.href = data.approvalUrl;
  };

  return (
    <section className="text-white">
      <div className="row w-full px-5 lg:px-0">
        <div className="mb-10 text-center lg:text-left">
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.25em] text-brand-200">
            {polyglot.t("workshops.page.title")}
          </p>
          <h2 className="mainTitle text-white">{polyglot.t("workshops.page.subtitle")}</h2>
        </div>

        <div className="grid gap-8 lg:grid-cols-2">
          {enabledWorkshops.map((workshop) => {
            const content = getWorkshopContent(workshop, language);
            const slotInfo = liveMetrics[workshop.id] || { availableSlots: 12, isFull: false };

            return (
              <article
                key={workshop.id}
                className="group overflow-hidden rounded-3xl border border-white/10 bg-white/5 shadow-[0_20px_50px_rgba(0,0,0,0.25)] backdrop-blur-sm transition-transform duration-300 hover:-translate-y-1"
              >
                <div className="relative h-72 w-full overflow-hidden bg-[#0d0a24]">
                  <Image
                    src={workshop.image}
                    alt={content.name}
                    fill
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    className="h-full w-full object-contain transition-transform duration-500 group-hover:scale-[1.02]"
                  />
                </div>

                <div className="-mt-px space-y-5 p-6">
                  <div className="flex items-center justify-between gap-3">
                    <span className="rounded-full border border-brand-200/70 bg-brand-200/10 px-3 py-1 text-xs font-medium uppercase tracking-[0.16em] text-brand-200">
                      {content.level}
                    </span>
                    <span className="text-sm font-semibold text-brand-200">{content.price}</span>
                  </div>

                  <div>
                    <h3 className="text-2xl font-semibold text-white">{content.name}</h3>
                    <p className="mt-3 text-sm leading-7 text-gray-300">{content.description}</p>
                  </div>

                  <ul className="space-y-3 text-sm text-gray-200">
                    <li className="flex items-center gap-3">
                      <CalendarDays size={16} className="text-brand-200" />
                      <span>{content.date}</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <MapPin size={16} className="text-brand-200" />
                      <span>{content.location}</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <Clock3 size={16} className="text-brand-200" />
                      <span>{content.duration}</span>
                    </li>
                    <li className="text-xs uppercase tracking-[0.16em] text-brand-200">
                      {slotInfo.isFull ? "LOTADO" : `${slotInfo.availableSlots}/12 vagas disponíveis`}
                    </li>
                  </ul>

                  <button
                    type="button"
                    onClick={() => openRegister(workshop)}
                    disabled={slotInfo.isFull}
                    className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-brand-200 px-5 py-3 text-sm font-semibold text-[#050123] transition-colors hover:bg-[#f3d54d] disabled:cursor-not-allowed disabled:bg-gray-600 disabled:text-gray-300"
                  >
                    {slotInfo.isFull ? "Lotado" : content.button}
                    {!slotInfo.isFull && <ArrowRight size={16} />}
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      </div>

      {selectedWorkshop && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#050123]/80 p-4 backdrop-blur-sm">
          <div className="relative w-full max-w-xl rounded-3xl border border-white/10 bg-[#0d0a24] p-6 shadow-[0_30px_80px_rgba(0,0,0,0.5)]">
            <button
              type="button"
              aria-label="Fechar"
              onClick={closeDialog}
              className="absolute right-4 top-4 rounded-full border border-white/10 p-2 text-white transition hover:bg-white/10"
            >
              <X size={18} />
            </button>

            <div className="mb-5 pr-10">
              <p className="text-xs uppercase tracking-[0.18em] text-brand-200">Workshop</p>
              <h3 className="mt-2 text-2xl font-semibold text-white">{getWorkshopContent(selectedWorkshop, language).name}</h3>
              <p className="mt-2 text-sm text-gray-300">{selectedWorkshop.price}</p>
            </div>

            {!reservation ? (
              <form className="space-y-4" onSubmit={handleRegistrationSubmit}>
                <div>
                  <label htmlFor="participantName" className="mb-2 block text-sm text-gray-200">Nome completo</label>
                  <input
                    id="participantName"
                    value={formData.participantName}
                    onChange={(event) => setFormData({ ...formData, participantName: event.target.value })}
                    className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none ring-0 placeholder:text-gray-400 focus:border-brand-200"
                    placeholder="Seu nome completo"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="email" className="mb-2 block text-sm text-gray-200">E-mail</label>
                  <input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(event) => setFormData({ ...formData, email: event.target.value })}
                    className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none placeholder:text-gray-400 focus:border-brand-200"
                    placeholder="seu@email.com"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="phone" className="mb-2 block text-sm text-gray-200">Telefone / WhatsApp</label>
                  <input
                    id="phone"
                    value={formData.phone}
                    onChange={(event) => setFormData({ ...formData, phone: event.target.value })}
                    className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none placeholder:text-gray-400 focus:border-brand-200"
                    placeholder="(00) 00000-0000"
                    required
                  />
                </div>

                {error && <p className="rounded-xl border border-red-500/50 bg-red-500/10 px-3 py-2 text-sm text-red-200">{error}</p>}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex w-full items-center justify-center rounded-full bg-brand-200 px-5 py-3 text-sm font-semibold text-[#050123] transition hover:bg-[#f3d54d] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isSubmitting ? "Reservando vaga..." : "Reservar vaga"}
                </button>
              </form>
            ) : (
              <div className="space-y-5">
                <div className="rounded-2xl border border-brand-200/50 bg-brand-200/10 p-4 text-sm text-white">
                  <p className="font-semibold text-brand-200">Resumo da inscrição</p>
                  <ul className="mt-3 space-y-2 text-gray-200">
                    <li><span className="font-medium text-white">Workshop:</span> {getWorkshopContent(selectedWorkshop, language).name}</li>
                    <li><span className="font-medium text-white">Participante:</span> {reservation.participantName}</li>
                    <li><span className="font-medium text-white">E-mail:</span> {reservation.email}</li>
                    <li><span className="font-medium text-white">Telefone:</span> {reservation.phone}</li>
                    <li><span className="font-medium text-white">Reserva:</span> {new Date(reservation.reservationExpiresAt).toLocaleString("pt-BR")}</li>
                  </ul>
                </div>

                <button
                  type="button"
                  onClick={handleContinueToPayment}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-brand-200 px-5 py-3 text-sm font-semibold text-[#050123] transition hover:bg-[#f3d54d]"
                >
                  Continuar para pagamento
                  <ArrowRight size={16} />
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
