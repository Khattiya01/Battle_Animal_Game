import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/utils/auth";

export async function CheckTermPagePage() {
  const session = await getServerSession(authOptions);
  if (!session?.user.term) {
    redirect("/login/term");
  }
}
