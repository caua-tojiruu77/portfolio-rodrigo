"use client";

import Image from "next/image";
import { ArrowRight, CalendarDays, CircleCheck, Clock3, MapPin, X } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { enabledWorkshops, getWorkshopContent, type Workshop } from "@/utils/workshops";

type RegistrationState = {
  id: string;
  publicCode: string;
  workshopId: string;
  participantName: string;
  email: string;
  phone: string;
  reservationExpiresAt: number;
  status: string;
  paymentMethod: "paypal" | "cash";
  cashPaymentStatus?: string | null;
  depositStatus?: "pending" | "paid" | null;
  depositAmount?: number;
};

export default function WorkshopsFeed() {
  const [selectedWorkshop, setSelectedWorkshop] = useState<Workshop | null>(null);
  const [formData, setFormData] = useState({ participantName: "", email: "", phone: "", paymentMethod: "paypal" as "paypal" | "cash" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [reservation, setReservation] = useState<RegistrationState | null>(null);
  const [error, setError] = useState("");
  const [paymentMessage, setPaymentMessage] = useState("");
  const [isConfirmingPayment, setIsConfirmingPayment] = useState(false);
  const handledPayPalOrder = useRef<string | null>(null);

  const [liveMetrics, setLiveMetrics] = useState<Record<string, {
    availableSlots: number;
    isFull: boolean;
    paypalAvailableSlots: number;
    cashAvailableSlots: number;
  }>>({});
  const selectedSlotInfo = selectedWorkshop
    ? liveMetrics[selectedWorkshop.id] || { paypalAvailableSlots: 6, cashAvailableSlots: 6 }
    : { paypalAvailableSlots: 6, cashAvailableSlots: 6 };

  const refreshLiveMetrics = useCallback(async () => {
    const response = await fetch("/api/workshops", { cache: "no-store" });
    if (!response.ok) return;

    const data = await response.json();
    const nextState = Object.fromEntries(
      (data.workshops || []).map((workshop: any) => [workshop.id, {
        availableSlots: workshop.availableSlots,
        isFull: workshop.isFull,
        paypalAvailableSlots: workshop.paypalAvailableSlots,
        cashAvailableSlots: workshop.cashAvailableSlots,
      }]),
    );

    setLiveMetrics(nextState);
  }, []);

  useEffect(() => {
    void refreshLiveMetrics();
    const refreshInterval = window.setInterval(() => void refreshLiveMetrics(), 10_000);
    return () => window.clearInterval(refreshInterval);
  }, [refreshLiveMetrics]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const paymentResult = params.get("payment");
    const orderId = params.get("token");

    if (!paymentResult) return;

    window.history.replaceState({}, "", window.location.pathname);

    if (paymentResult === "cancelled") {
      setError("Payment was cancelled. Your reservation has not been confirmed.");
      return;
    }

    if (paymentResult !== "success" || !orderId || handledPayPalOrder.current === orderId) {
      if (!orderId) setError("PayPal did not return a payment identifier. Please contact us before trying again.");
      return;
    }

    handledPayPalOrder.current = orderId;
    setIsConfirmingPayment(true);

    const capturePayment = async () => {
      try {
        const response = await fetch("/api/paypal/capture", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ orderId }),
        });
        const data = await response.json().catch(() => ({}));

        if (!response.ok || !data.ok) {
          throw new Error(data.error || "We could not confirm the PayPal payment. Please contact us before paying again.");
        }

        sessionStorage.removeItem("workshopRegistration");
        void refreshLiveMetrics();
        setPaymentMessage(data.deposit
          ? "Your €10 reservation fee was received. Your place is reserved and the remaining €15 is due on the workshop day."
          : "Payment confirmed. Your workshop place is reserved.");
      } catch (paymentError) {
        setError(paymentError instanceof Error ? paymentError.message : "We could not confirm the PayPal payment.");
      } finally {
        setIsConfirmingPayment(false);
      }
    };

    void capturePayment();
  }, [refreshLiveMetrics]);

  if (!enabledWorkshops.length) {
    return null;
  }

  const openRegister = (workshop: Workshop) => {
    setSelectedWorkshop(workshop);
    setFormData({ participantName: "", email: "", phone: "", paymentMethod: "paypal" });
    setReservation(null);
    setError("");
  };

  const closeDialog = () => {
    setSelectedWorkshop(null);
    setFormData({ participantName: "", email: "", phone: "", paymentMethod: "paypal" });
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
          paymentMethod: formData.paymentMethod,
        }),
      });

      const data = await response.json();
      if (!response.ok || !data.ok) {
        throw new Error(data.error || "Unable to reserve a place.");
      }

      setReservation(data.registration);
      void refreshLiveMetrics();
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Unable to reserve a place.");
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
      setError(data.error || "Unable to start payment.");
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
      {isConfirmingPayment && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-[#050123]/85 p-4 backdrop-blur-sm" role="status" aria-live="polite">
          <div className="w-full max-w-md rounded-3xl border border-brand-200/40 bg-[#0d0a24] p-8 text-center shadow-[0_30px_80px_rgba(0,0,0,0.55)]">
            <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-brand-200/25 border-t-brand-200" aria-hidden="true" />
            <p className="mt-6 text-xs font-semibold uppercase tracking-[0.2em] text-brand-200">Please wait</p>
            <h2 className="mt-3 text-2xl font-semibold text-white">Confirming your payment</h2>
            <p className="mt-3 text-sm leading-6 text-gray-300">We are securely confirming your PayPal payment and reserving your workshop place.</p>
          </div>
        </div>
      )}
      {paymentMessage && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-[#050123]/85 p-4 backdrop-blur-sm" role="dialog" aria-modal="true" aria-labelledby="payment-confirmation-title">
          <div className="relative w-full max-w-md rounded-3xl border border-emerald-400/50 bg-[#0d0a24] p-7 text-center shadow-[0_30px_80px_rgba(0,0,0,0.55)]">
            <button
              type="button"
              aria-label="Close payment confirmation"
              onClick={() => setPaymentMessage("")}
              className="absolute right-4 top-4 rounded-full border border-white/10 p-2 text-white transition hover:bg-white/10"
            >
              <X size={18} />
            </button>
            <CircleCheck size={50} className="mx-auto text-emerald-300" aria-hidden="true" />
            <p className="mt-5 text-xs font-semibold uppercase tracking-[0.2em] text-emerald-300">Payment successful</p>
            <h2 id="payment-confirmation-title" className="mt-3 text-2xl font-semibold text-white">Your place is confirmed</h2>
            <p className="mt-4 text-sm leading-6 text-gray-200">{paymentMessage}</p>
            <button
              type="button"
              onClick={() => setPaymentMessage("")}
              className="mt-6 w-full rounded-full bg-emerald-300 px-5 py-3 text-sm font-semibold text-[#050123] transition hover:bg-emerald-200"
            >
              Great, thank you
            </button>
          </div>
        </div>
      )}
      <div className="row w-full px-5 lg:px-0">
        {error && !selectedWorkshop && <p className="mb-6 rounded-2xl border border-red-400/50 bg-red-400/10 px-4 py-3 text-sm text-red-100">{error}</p>}
        <div className="mb-10 text-center lg:text-left">
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.25em] text-brand-200">
            Workshops
          </p>
          <h2 className="mainTitle text-white">Learn technique, balance and confidence in a practical environment.</h2>
        </div>

        <div className="grid gap-8 lg:grid-cols-2">
          {enabledWorkshops.map((workshop) => {
            const content = getWorkshopContent(workshop, "en");
            const slotInfo = liveMetrics[workshop.id] || { availableSlots: 12, isFull: false, paypalAvailableSlots: 6, cashAvailableSlots: 6 };

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
                      {slotInfo.isFull ? "FULL" : `${slotInfo.availableSlots}/12 places available`}
                    </li>
                    <li className="text-xs text-gray-300">
                      Online: {slotInfo.paypalAvailableSlots}/6 · Pay on the day: {slotInfo.cashAvailableSlots}/6
                    </li>
                  </ul>

                  <button
                    type="button"
                    onClick={() => openRegister(workshop)}
                    disabled={slotInfo.isFull}
                    className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-brand-200 px-5 py-3 text-sm font-semibold text-[#050123] transition-colors hover:bg-[#f3d54d] disabled:cursor-not-allowed disabled:bg-gray-600 disabled:text-gray-300"
                  >
                    {slotInfo.isFull ? "Full" : "Enroll now"}
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
              aria-label="Close"
              onClick={closeDialog}
              className="absolute right-4 top-4 rounded-full border border-white/10 p-2 text-white transition hover:bg-white/10"
            >
              <X size={18} />
            </button>

            <div className="mb-5 pr-10">
              <p className="text-xs uppercase tracking-[0.18em] text-brand-200">Workshop</p>
              <h3 className="mt-2 text-2xl font-semibold text-white">{getWorkshopContent(selectedWorkshop, "en").name}</h3>
              <p className="mt-2 text-sm text-gray-300">{selectedWorkshop.price}</p>
            </div>

            {!reservation ? (
              <form className="space-y-4" onSubmit={handleRegistrationSubmit}>
                <div>
                  <label htmlFor="participantName" className="mb-2 block text-sm text-gray-200">Full name</label>
                  <input
                    id="participantName"
                    value={formData.participantName}
                    onChange={(event) => setFormData({ ...formData, participantName: event.target.value })}
                    className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none ring-0 placeholder:text-gray-400 focus:border-brand-200"
                    placeholder="Your full name"
                    required
                  />
                </div>

                <fieldset className="space-y-2">
                  <legend className="mb-2 block text-sm text-gray-200">Payment method</legend>
                  <label className="flex cursor-pointer items-start gap-3 rounded-2xl border border-white/10 bg-white/5 p-3 text-sm text-gray-200">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="paypal"
                      checked={formData.paymentMethod === "paypal"}
                      onChange={() => setFormData({ ...formData, paymentMethod: "paypal" })}
                      disabled={selectedSlotInfo.paypalAvailableSlots === 0}
                      required
                    />
                    <span><strong className="text-white">Pay with PayPal</strong><br />6 online places · {selectedSlotInfo.paypalAvailableSlots} available</span>
                  </label>
                  <label className="flex cursor-pointer items-start gap-3 rounded-2xl border border-white/10 bg-white/5 p-3 text-sm text-gray-200">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="cash"
                      checked={formData.paymentMethod === "cash"}
                      onChange={() => setFormData({ ...formData, paymentMethod: "cash" })}
                      disabled={selectedSlotInfo.cashAvailableSlots === 0}
                    />
                    <span><strong className="text-white">Pay on the day</strong><br />6 in-person places · {selectedSlotInfo.cashAvailableSlots} available</span>
                  </label>
                </fieldset>

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
                  <label htmlFor="phone" className="mb-2 block text-sm text-gray-200">Phone / WhatsApp</label>
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
                  {isSubmitting ? "Reserving place..." : "Reserve place"}
                </button>
              </form>
            ) : (
              <div className="space-y-5">
                <div className="rounded-2xl border border-brand-200/50 bg-brand-200/10 p-4 text-sm text-white">
                  <p className="font-semibold text-brand-200">Registration summary</p>
                  <ul className="mt-3 space-y-2 text-gray-200">
                    <li><span className="font-medium text-white">Workshop:</span> {getWorkshopContent(selectedWorkshop, "en").name}</li>
                    <li><span className="font-medium text-white">Participant:</span> {reservation.participantName}</li>
                    <li><span className="font-medium text-white">Email:</span> {reservation.email}</li>
                    <li><span className="font-medium text-white">Phone:</span> {reservation.phone}</li>
                    <li><span className="font-medium text-white">Registration Code:</span> {reservation.publicCode}</li>
                    <li><span className="font-medium text-white">Reservation expires:</span> {reservation.reservationExpiresAt ? new Date(reservation.reservationExpiresAt).toLocaleString("en-GB") : "No expiration"}</li>
                  </ul>
                </div>

                {reservation.paymentMethod === "cash" && reservation.depositStatus !== "paid" ? (
                  <div className="rounded-2xl border border-emerald-500/40 bg-emerald-500/10 p-4 text-sm text-emerald-100">
                    <p className="font-semibold">Reserve your place · €10 confirmation fee</p>
                    <p className="mt-2">To secure your place, please pay a €10 reservation fee via PayPal. It helps us hold places fairly in case of no-shows and is deducted from the €25 workshop fee. If your plans change, please let us know at least 48 hours before the workshop to request a refund. The remaining €15 is due on the workshop day.</p>
                    <button
                      type="button"
                      onClick={async () => {
                        const response = await fetch("/api/paypal/create-order", {
                          method: "POST",
                          headers: { "Content-Type": "application/json" },
                          body: JSON.stringify({ workshopId: selectedWorkshop.id, registrationId: reservation.id }),
                        });
                        const data = await response.json();
                        if (!response.ok || !data.ok || !data.approvalUrl) {
                          setError(data.error || "Unable to start deposit payment.");
                          return;
                        }
                        sessionStorage.setItem("workshopRegistration", JSON.stringify({
                          workshopId: selectedWorkshop.id,
                          registrationId: reservation.id,
                          orderId: data.orderId,
                          amount: 10,
                          currency: selectedWorkshop.currency,
                          paymentType: "cash_deposit",
                        }));
                        window.location.href = data.approvalUrl;
                      }}
                      className="mt-4 inline-flex w-full items-center justify-center rounded-full bg-brand-200 px-5 py-3 text-sm font-semibold text-[#050123] transition hover:bg-[#f3d54d]"
                    >
                      Pay €10 reservation fee with PayPal
                    </button>
                  </div>
                ) : reservation.paymentMethod === "cash" ? (
                  <div className="rounded-2xl border border-emerald-500/40 bg-emerald-500/10 p-4 text-sm text-emerald-100">
                    <p className="font-semibold">Place confirmed</p>
                    <p className="mt-2">Your €10 reservation fee was received and deducted from the workshop price. It helps us hold places fairly in case of no-shows. If your plans change, please let us know at least 48 hours before the workshop to request a refund. The remaining €15 is due on the workshop day.</p>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={handleContinueToPayment}
                    className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-brand-200 px-5 py-3 text-sm font-semibold text-[#050123] transition hover:bg-[#f3d54d]"
                  >
                    Continue to PayPal
                    <ArrowRight size={16} />
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
