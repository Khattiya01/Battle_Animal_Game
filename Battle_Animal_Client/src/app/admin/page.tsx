import { redirect } from "next/navigation";
import { CheckTermPagePage } from "@/utils/check-term-page";
import { ROLE } from "@/types/role";
import { SecurePage } from "@/utils/secure-page";

export default async function Adminpage() {
  await SecurePage({ role: ROLE.admin });
  await CheckTermPagePage();
  await redirect("/admin/manage-user");
  return <></>;
}
