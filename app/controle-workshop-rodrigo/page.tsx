import { redirect } from "next/navigation";

export default function HiddenWorkshopAdminEntry() {
  redirect("/admin/workshops");
}
