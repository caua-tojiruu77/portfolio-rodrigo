import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { listWorkshopRegistrations, getWorkshopMetrics } from "@/utils/workshopStore";
import { enabledWorkshops } from "@/utils/workshops";
import { ADMIN_SESSION_COOKIE, validateAdminSession } from "@/utils/adminAuth";

export const dynamic = "force-dynamic";

export default async function AdminWorkshopsPage() {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get(ADMIN_SESSION_COOKIE)?.value;

  if (!validateAdminSession(sessionToken)) {
    redirect("/admin/login");
  }

  const registrations = await listWorkshopRegistrations();
  const metrics = await Promise.all(
    enabledWorkshops.map(async (workshop) => ({
      id: workshop.id,
      name: workshop.translations.it.name,
      ...(await getWorkshopMetrics(workshop.id)),
    })),
  );

  return (
    <main className="row px-5 pb-16 pt-10 text-white lg:px-0">
      <h1 className="mb-6 text-3xl font-bold text-white">Administração de Workshops</h1>

      <div className="mb-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {metrics.map((workshop) => (
          <div key={workshop.id} className="rounded-2xl border border-white/10 bg-white/5 p-5">
            <p className="text-xs uppercase tracking-[0.18em] text-brand-200">{workshop.id}</p>
            <h2 className="mt-2 text-xl font-semibold text-white">{workshop.name}</h2>
            <p className="mt-3 text-sm text-gray-200">Capacidade: {workshop.capacity}</p>
            <p className="text-sm text-gray-200">Confirmadas: {workshop.confirmedCount}</p>
            <p className="text-sm text-gray-200">Pendentes: {workshop.pendingCount}</p>
            <p className="text-sm text-gray-200">Disponíveis: {workshop.availableSlots}</p>
          </div>
        ))}
      </div>

      <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/5">
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm text-gray-200">
            <thead className="bg-white/5 text-gray-100">
              <tr>
                <th className="px-4 py-3">Workshop</th>
                <th className="px-4 py-3">Participante</th>
                <th className="px-4 py-3">E-mail</th>
                <th className="px-4 py-3">Telefone</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">PayPal</th>
                <th className="px-4 py-3">Comparecimento</th>
              </tr>
            </thead>
            <tbody>
              {registrations.map((registration) => (
                <tr key={registration.id} className="border-t border-white/10">
                  <td className="px-4 py-3">{registration.workshopId}</td>
                  <td className="px-4 py-3">{registration.participantName}</td>
                  <td className="px-4 py-3">{registration.email}</td>
                  <td className="px-4 py-3">{registration.phone}</td>
                  <td className="px-4 py-3">{registration.status}</td>
                  <td className="px-4 py-3">{registration.transactionId || registration.paypalOrderId || "—"}</td>
                  <td className="px-4 py-3">
                    <form action="/api/admin/workshops/attendance" method="POST" className="flex gap-2">
                      <input type="hidden" name="registrationId" value={registration.id} />
                      <button type="submit" name="attendanceStatus" value="present" className="rounded-full border border-emerald-500/60 bg-emerald-500/10 px-2 py-1 text-xs text-emerald-200">
                        Compareceu
                      </button>
                      <button type="submit" name="attendanceStatus" value="absent" className="rounded-full border border-red-500/60 bg-red-500/10 px-2 py-1 text-xs text-red-200">
                        Não compareceu
                      </button>
                    </form>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}
