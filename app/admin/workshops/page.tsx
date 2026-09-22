import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { listActiveWorkshopRegistrations, getWorkshopMetrics } from "@/utils/workshopStore";
import { enabledWorkshops } from "@/utils/workshops";
import { ADMIN_SESSION_COOKIE, validateAdminSession } from "@/utils/adminAuth";
import AdminWorkshopsPanel from "@/components/admin/adminWorkshopsPanel";

export const dynamic = "force-dynamic";

export default async function AdminWorkshopsPage() {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get(ADMIN_SESSION_COOKIE)?.value;

  if (!validateAdminSession(sessionToken)) {
    redirect("/admin/login");
  }

  const registrations = await listActiveWorkshopRegistrations();
  const metrics = await Promise.all(
    enabledWorkshops.map(async (workshop) => ({
      id: workshop.id,
      name: workshop.translations.it.name,
      ...(await getWorkshopMetrics(workshop.id)),
    })),
  );

  return (
    <main className="w-full px-4 pb-16 pt-10 text-white sm:px-6 xl:px-10">
      <h1 className="mb-6 text-3xl font-bold text-white">Workshop Administration</h1>

      <AdminWorkshopsPanel initialMetrics={metrics} initialRegistrations={registrations} />
    </main>
  );
}
