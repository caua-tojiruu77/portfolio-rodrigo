"use client";

import { useState } from "react";

type Registration = {
  id: string;
  publicCode: string;
  workshopId: string;
  participantName: string;
  email: string;
  phone: string;
  status: string;
  paymentMethod?: "paypal" | "stripe" | "cash" | null;
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

  return (
    <>
      {message && <p className="mb-4 rounded-xl border border-emerald-500/40 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-200">{message}</p>}
      {error && <p className="mb-4 rounded-xl border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-200">{error}</p>}

      <label className="mb-4 block">
        <span className="mb-2 block text-sm text-gray-300">Search by registration code, name or email</span>
        <input
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="A7K392, name or email"
          className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none placeholder:text-gray-500 focus:border-brand-200"
        />
      </label>

      <div className="mb-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {metrics.map((workshop) => (
          <div key={workshop.id} className="rounded-2xl border border-white/10 bg-white/5 p-5">
            <p className="text-xs uppercase tracking-[0.18em] text-brand-200">{workshop.id}</p>
            <h2 className="mt-2 text-xl font-semibold text-white">{workshop.name}</h2>
            <p className="mt-3 text-sm text-gray-200">Capacity: {workshop.capacity}</p>
            <p className="text-sm text-gray-200">PayPal: {workshop.paypalConfirmedCount + workshop.paypalPendingCount}/{workshop.paypalCapacity}</p>
            <p className="text-sm text-gray-200">Pay on the day: {workshop.cashReservedCount}/{workshop.cashCapacity}</p>
            <p className="text-sm text-gray-200">Available: {workshop.availableSlots}</p>
          </div>
        ))}
      </div>

      <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/5">
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
                <th className="px-4 py-3">Ações</th>
              </tr>
            </thead>
            <tbody>
              {registrations.filter((registration) => {
                const query = search.trim().toLowerCase();
                if (!query) return true;
                return [registration.publicCode, registration.participantName, registration.email]
                  .some((value) => value.toLowerCase().includes(query));
              }).map((registration) => {
                const isBusy = busyId === registration.id;
                const paymentReference = registration.transactionId || registration.paypalOrderId || registration.paypalCaptureId || "—";

                return (
                  <tr key={registration.id} className="border-t border-white/10">
                    <td className="px-4 py-3 font-mono font-semibold text-brand-200">{registration.publicCode}</td>
                    <td className="px-4 py-3">{registration.workshopId}</td>
                    <td className="px-4 py-3">{registration.participantName}</td>
                    <td className="px-4 py-3">{registration.email}</td>
                    <td className="px-4 py-3">{registration.phone}</td>
                    <td className="px-4 py-3">{registration.paymentMethod === "cash" ? "Pay on the day" : registration.paymentMethod === "stripe" ? "Paid by card" : "Paid via PayPal"}</td>
                    <td className="px-4 py-3">
                      <span>{formatStatus(registration.status)}</span>
                      {registration.paymentMethod === "cash" && <span className="block text-xs text-gray-400">Deposit: {registration.depositStatus || "pending"}</span>}
                      <span className="block text-xs text-gray-400">Reservation: {formatOptionalDate(registration.reservationExpiresAt)}</span>
                    </td>
                    <td className="px-4 py-3">{paymentReference}</td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-2">
                        {registration.paymentMethod === "cash" && registration.status === "reserved_cash" && (
                          <button
                            type="button"
                            disabled={isBusy}
                            onClick={() => processAction(registration.id, "/api/admin/workshops/payment", { cashPaymentStatus: "paid" }, "Cash payment marked as received.")}
                            className="rounded-full border border-brand-200/60 bg-brand-200/10 px-2 py-1 text-xs text-brand-100 disabled:opacity-50"
                          >
                            {isBusy ? "Updating..." : "Mark paid"}
                          </button>
                        )}
                        {registration.status !== "cancelled" && registration.status !== "expired" && (
                          <button
                            type="button"
                            disabled={isBusy}
                            onClick={() => processAction(registration.id, "/api/admin/workshops/cancel", {}, "Reservation cancelled and seat released.")}
                            className="rounded-full border border-orange-500/60 bg-orange-500/10 px-2 py-1 text-xs text-orange-200 disabled:opacity-50"
                          >
                            {isBusy ? "Updating..." : "Cancel reservation"}
                          </button>
                        )}
                        <button
                          type="button"
                          disabled={isBusy}
                          onClick={() => processAction(registration.id, "/api/admin/workshops/attendance", { attendanceStatus: "present" }, "Attendance marked as present.")}
                          className="rounded-full border border-emerald-500/60 bg-emerald-500/10 px-2 py-1 text-xs text-emerald-200 disabled:opacity-50"
                        >
                          Present
                        </button>
                        <button
                          type="button"
                          disabled={isBusy}
                          onClick={() => processAction(registration.id, "/api/admin/workshops/attendance", { attendanceStatus: "absent" }, "Attendance marked as absent.")}
                          className="rounded-full border border-red-500/60 bg-red-500/10 px-2 py-1 text-xs text-red-200 disabled:opacity-50"
                        >
                          Absent
                        </button>
                      </div>
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
