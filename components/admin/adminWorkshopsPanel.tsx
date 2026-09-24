"use client";

import { useState, type FormEvent } from "react";
import { ChevronDown } from "lucide-react";

type Registration = {
  id: string;
  publicCode: string;
  workshopId: string;
  participantName: string;
  email: string;
  phone: string;
  status: string;
  paymentMethod?: "paypal" | "cash" | null;
  cashPaymentStatus?: string | null;
  depositStatus?: string | null;
  depositAmount?: number;
  reservationExpiresAt?: number | null;
  paymentApprovedAt?: number | null;
  paypalOrderId?: string | null;
  paypalCaptureId?: string | null;
  transactionId?: string | null;
  attendanceStatus?: "present" | "absent" | null;
  attendeeCheckInAt?: number | null;
};

type WorkshopMetrics = {
  id: string;
  name: string;
  capacity: number;
  paypalCapacity: number;
  paypalConfirmedCount: number;
  paypalPendingCount: number;
  cashCapacity: number;
  cashReservedCount: number;
  availableSlots: number;
};

type ApiResponse = {
  ok?: boolean;
  registration?: Registration;
  error?: string;
};

function formatOptionalDate(value: number | null | undefined) {
  return value ? new Date(value).toLocaleString("en-GB") : "—";
}

function formatStatus(status: string) {
  return {
    pending: "Pending PayPal payment",
    paid: "Paid via PayPal",
    reserved_cash: "Reserved - cash payment pending",
    cash_paid: "Paid in cash",
    cancelled: "Cancelled",
    expired: "Expired",
  }[status] || status;
}

function formatAttendanceStatus(status: Registration["attendanceStatus"]) {
  if (status === "present") return "Present";
  if (status === "absent") return "Absent";
  return "Pending";
}

export default function AdminWorkshopsPanel({
  initialMetrics,
  initialRegistrations,
  accessToken,
}: {
  initialMetrics: WorkshopMetrics[];
  initialRegistrations: Registration[];
  accessToken?: string;
}) {
  const [metrics, setMetrics] = useState(initialMetrics);
  const [registrations, setRegistrations] = useState(initialRegistrations);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [selectedWorkshopId, setSelectedWorkshopId] = useState<string | null>(null);
  const [previewEmail, setPreviewEmail] = useState("");
  const [previewWorkshopId, setPreviewWorkshopId] = useState(initialMetrics[0]?.id || "");
  const [isPreviewSending, setIsPreviewSending] = useState(false);
  const [previewMessage, setPreviewMessage] = useState("");
  const [previewError, setPreviewError] = useState("");

  const sendEmailPreview = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsPreviewSending(true);
    setPreviewMessage("");
    setPreviewError("");
    try {
      const response = await fetch("/api/admin/workshops/email-preview", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: previewEmail, workshopId: previewWorkshopId }),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok || !data.ok) throw new Error(data.error || "Unable to send the preview email.");
      setPreviewMessage(data.message || "Preview email sent.");
    } catch (previewRequestError) {
      setPreviewError(previewRequestError instanceof Error ? previewRequestError.message : "Unable to send the preview email.");
    } finally {
      setIsPreviewSending(false);
    }
  };

  const refreshMetrics = async () => {
    const response = await fetch("/api/workshops", { cache: "no-store" });
    if (!response.ok) return;

    const data = await response.json();
    if (!Array.isArray(data.workshops)) return;

    setMetrics((current) => current.map((metric) => {
      const next = data.workshops.find((entry: { id: string }) => entry.id === metric.id);
      return next ? { ...metric, ...next } : metric;
    }));
  };

  const processAction = async (
    registrationId: string,
    endpoint: string,
    body: Record<string, string>,
    successMessage: string,
  ) => {
    setBusyId(registrationId);
    setError("");
    setMessage("");

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(accessToken ? { "x-event-access-token": accessToken } : {}),
        },
        body: JSON.stringify({ registrationId, ...body }),
      });
      const data = (await response.json().catch(() => ({}))) as ApiResponse;

      if (!response.ok || data.ok !== true || !data.registration) {
        throw new Error(data.error || "Unable to update the registration.");
      }

      setRegistrations((current) => current.flatMap((registration) => {
        if (registration.id !== data.registration?.id) return [registration];
        return ["cancelled", "expired"].includes(data.registration.status) ? [] : [data.registration];
      }));
      await refreshMetrics();
      setMessage(successMessage);
    } catch (actionError) {
      setError(actionError instanceof Error ? actionError.message : "Unable to update the registration.");
    } finally {
      setBusyId(null);
    }
  };

  const updateAttendance = async (registrationId: string, attendanceStatus: "pending" | "present" | "absent") => {
    await processAction(
      registrationId,
      "/api/admin/workshops/attendance",
      { attendanceStatus },
      `Attendance updated: ${attendanceStatus}.`,
    );
  };

  const filteredRegistrations = registrations.filter((registration) => {
    if (selectedWorkshopId && registration.workshopId !== selectedWorkshopId) return false;
    const query = search.trim().toLowerCase();
    if (!query) return true;
    return [registration.publicCode, registration.participantName, registration.email]
      .some((value) => value.toLowerCase().includes(query));
  });

  const renderAttendanceSelect = (registration: Registration, isBusy: boolean) => (
    <div className="relative min-w-40">
      <label className="sr-only" htmlFor={`attendance-${registration.id}`}>Attendance status for {registration.participantName}</label>
      <select
        id={`attendance-${registration.id}`}
        value={registration.attendanceStatus || "pending"}
        disabled={isBusy}
        onChange={(event) => void updateAttendance(registration.id, event.target.value as "pending" | "present" | "absent")}
        className={`w-full appearance-none rounded-full border py-2 pl-4 pr-10 text-sm font-semibold text-black shadow-sm outline-none transition focus:ring-2 disabled:cursor-not-allowed disabled:opacity-50 ${
          registration.attendanceStatus === "present"
            ? "border-emerald-400 bg-emerald-300 focus:ring-emerald-300/50"
            : registration.attendanceStatus === "absent"
              ? "border-red-400 bg-red-300 focus:ring-red-300/50"
              : "border-amber-400 bg-amber-300 focus:ring-amber-300/50"
        }`}
      >
        <option value="pending">{formatAttendanceStatus(null)}</option>
        <option value="present">Present</option>
        <option value="absent">Absent</option>
      </select>
      <ChevronDown size={17} aria-hidden="true" className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-black" />
    </div>
  );

  const renderActions = (registration: Registration, isBusy: boolean) => (
    <div className="flex flex-wrap gap-2">
      {registration.paymentMethod === "cash" && registration.status === "reserved_cash" && registration.depositStatus === "paid" && (
        <button type="button" disabled={isBusy} onClick={() => processAction(registration.id, "/api/admin/workshops/payment", { cashPaymentStatus: "paid" }, "Cash payment marked as received.")} className="min-w-28 whitespace-nowrap rounded-full border border-amber-400 bg-amber-300 px-4 py-2 text-xs font-semibold text-black transition hover:bg-amber-200 disabled:opacity-50">
          {isBusy ? "Updating..." : "Mark as Paid"}
        </button>
      )}
      {registration.status !== "cancelled" && registration.status !== "expired" && (
        <button type="button" disabled={isBusy} onClick={() => processAction(registration.id, "/api/admin/workshops/cancel", {}, "Reservation cancelled and seat released.")} className="rounded-full border border-red-400 bg-red-300 px-3 py-2 text-xs font-semibold leading-4 text-black transition hover:bg-red-200 disabled:opacity-50">
          {isBusy ? "Updating..." : "Cancel"}
        </button>
      )}
    </div>
  );

  return (
    <>
      {message && <p className="mb-4 rounded-xl border border-emerald-500/40 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-200">{message}</p>}
      {error && <p className="mb-4 rounded-xl border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-200">{error}</p>}

      <form onSubmit={sendEmailPreview} className="mb-8 rounded-2xl border border-brand-200/30 bg-white/5 p-5">
        <h2 className="text-lg font-semibold text-white">Preview the workshop ticket email</h2>
        <p className="mt-1 text-sm text-gray-300">Sends a clearly marked preview to your address. It does not create a reservation, charge a payment, or notify the administrator.</p>
        <div className="mt-4 grid gap-3 sm:grid-cols-[1fr_1fr_auto]">
          <label className="block">
            <span className="mb-2 block text-sm text-gray-300">Your email address</span>
            <input
              type="email"
              value={previewEmail}
              onChange={(event) => setPreviewEmail(event.target.value)}
              placeholder="you@example.com"
              required
              className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none placeholder:text-gray-500 focus:border-brand-200"
            />
          </label>
          <label className="block">
            <span className="mb-2 block text-sm text-gray-300">Workshop cover</span>
            <select
              value={previewWorkshopId}
              onChange={(event) => setPreviewWorkshopId(event.target.value)}
              required
              className="w-full rounded-xl border border-white/10 bg-[#0d0a24] px-4 py-3 text-white outline-none focus:border-brand-200"
            >
              {metrics.map((workshop) => <option key={workshop.id} value={workshop.id}>{workshop.name}</option>)}
            </select>
          </label>
          <button
            type="submit"
            disabled={isPreviewSending || !previewWorkshopId}
            className="self-end rounded-full bg-brand-200 px-5 py-3 text-sm font-semibold text-[#050123] transition hover:bg-[#f3d54d] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isPreviewSending ? "Sending…" : "Send preview"}
          </button>
        </div>
        {previewMessage && <p role="status" className="mt-3 text-sm text-emerald-200">{previewMessage}</p>}
        {previewError && <p role="alert" className="mt-3 text-sm text-red-200">{previewError}</p>}
      </form>

      <label className="mb-4 block">
        <span className="mb-2 block text-sm text-gray-300">Search by registration code, name or email</span>
        <input
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="A7K392, name or email"
          className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none placeholder:text-gray-500 focus:border-brand-200"
        />
      </label>

      <div className="mb-3 flex flex-wrap items-center gap-2">
        <span className="text-sm text-gray-300">Showing:</span>
        <button
          type="button"
          onClick={() => setSelectedWorkshopId(null)}
          className={`rounded-full border px-4 py-2 text-sm font-semibold transition ${selectedWorkshopId === null ? "border-brand-200 bg-brand-200 text-[#050123]" : "border-white/15 bg-white/5 text-white hover:border-brand-200"}`}
        >
          All workshops
        </button>
      </div>

      <div className="mb-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {metrics.map((workshop) => (
          <button
            type="button"
            key={workshop.id}
            onClick={() => setSelectedWorkshopId(workshop.id)}
            aria-pressed={selectedWorkshopId === workshop.id}
            className={`rounded-2xl border p-5 text-left transition focus:outline-none focus:ring-2 focus:ring-brand-200 ${selectedWorkshopId === workshop.id ? "border-brand-200 bg-brand-200/15 shadow-[0_0_0_1px_rgba(255,215,11,0.25)]" : "border-white/10 bg-white/5 hover:border-brand-200/60 hover:bg-white/10"}`}
          >
            <p className="text-xs uppercase tracking-[0.18em] text-brand-200">{workshop.id}</p>
            <h2 className="mt-2 text-xl font-semibold text-white">{workshop.name}</h2>
            <p className="mt-3 text-sm text-gray-200">Capacity: {workshop.capacity}</p>
            <p className="text-sm text-gray-200">PayPal: {workshop.paypalConfirmedCount + workshop.paypalPendingCount}/{workshop.paypalCapacity}</p>
            <p className="text-sm text-gray-200">Pay on the day: {workshop.cashReservedCount}/{workshop.cashCapacity}</p>
            <p className="text-sm text-gray-200">Available: {workshop.availableSlots}</p>
            <p className="mt-4 text-xs font-semibold uppercase tracking-[0.14em] text-brand-200">View registrations →</p>
          </button>
        ))}
      </div>

      <div className="space-y-3 md:hidden">
        {filteredRegistrations.map((registration) => {
          const isBusy = busyId === registration.id;
          return (
            <article key={registration.id} className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="font-mono text-sm font-semibold text-brand-200">{registration.publicCode}</p>
                  <h2 className="mt-1 break-words text-lg font-semibold text-white">{registration.participantName}</h2>
                  <p className="mt-1 break-all text-sm text-gray-300">{registration.email}</p>
                  <p className="text-sm text-gray-300">{registration.phone}</p>
                </div>
                <span className="shrink-0 rounded-full border border-white/15 px-2 py-1 text-xs text-gray-200">{registration.paymentMethod === "cash" ? "Pay on day" : "PayPal"}</span>
              </div>
              <div className="mt-4 grid gap-3 border-t border-white/10 pt-4 text-sm">
                <p><span className="text-gray-400">Workshop:</span> <span className="break-words text-gray-100">{registration.workshopId}</span></p>
                <p><span className="text-gray-400">Payment:</span> {formatStatus(registration.status)}</p>
                {registration.paymentMethod === "cash" && <p className="text-xs text-gray-400">PayPal deposit: €{registration.depositAmount || 10} ({registration.depositStatus || "pending"}) · €15 due in cash</p>}
                <div>
                  <p className="mb-2 text-xs font-medium uppercase tracking-wide text-gray-400">Attendance</p>
                  {renderAttendanceSelect(registration, isBusy)}
                </div>
                {renderActions(registration, isBusy)}
              </div>
            </article>
          );
        })}
        {!filteredRegistrations.length && <p className="rounded-2xl border border-white/10 p-4 text-sm text-gray-300">No registrations found.</p>}
      </div>

      <div className="hidden overflow-hidden rounded-2xl border border-white/10 bg-white/5 md:block">
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm text-gray-200">
            <thead className="bg-white/5 text-gray-100">
              <tr>
                <th className="px-4 py-3">Code</th>
                <th className="px-4 py-3">Workshop</th>
                <th className="px-4 py-3">Participant</th>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">Phone</th>
                <th className="px-4 py-3">Payment</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">PayPal</th>
                <th className="px-4 py-3">Attendance</th>
                <th className="px-4 py-3">Ações</th>
              </tr>
            </thead>
            <tbody>
              {filteredRegistrations.map((registration) => {
                const isBusy = busyId === registration.id;
                const paymentReference = registration.transactionId || registration.paypalOrderId || registration.paypalCaptureId || "—";

                return (
                  <tr key={registration.id} className="border-t border-white/10">
                    <td className="px-4 py-3 font-mono font-semibold text-brand-200">{registration.publicCode}</td>
                    <td className="px-4 py-3">{registration.workshopId}</td>
                    <td className="px-4 py-3">{registration.participantName}</td>
                    <td className="px-4 py-3">{registration.email}</td>
                    <td className="px-4 py-3">{registration.phone}</td>
                    <td className="px-4 py-3">{registration.paymentMethod === "cash" ? "Pay on the day" : "Paid via PayPal"}</td>
                    <td className="px-4 py-3">
                      <span>{formatStatus(registration.status)}</span>
                      {registration.paymentMethod === "cash" && <span className="block text-xs text-gray-400">PayPal deposit: €{registration.depositAmount || 10} ({registration.depositStatus || "pending"}) · €15 due in cash</span>}
                      <span className="block text-xs text-gray-400">Reservation: {formatOptionalDate(registration.reservationExpiresAt)}</span>
                    </td>
                    <td className="px-4 py-3">{paymentReference}</td>
                    <td className="px-4 py-3">
                      {renderAttendanceSelect(registration, isBusy)}
                    </td>
                    <td className="px-4 py-3">
                      {renderActions(registration, isBusy)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
