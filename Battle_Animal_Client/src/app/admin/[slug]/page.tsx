import { ROLE } from "@/types/role";
import { SecurePage } from "@/utils/secure-page";
import { Flex } from "@radix-ui/themes";
import { ManageUser } from "../components/manages/user";
import { ManageGame } from "../components/manages/game";

export default async function AdminManagePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const manageName = (await params).slug;
  await SecurePage({ role: ROLE.admin });

  return (
    <Flex width={"100%"} direction={"column"} gap={"4"} p={"4"}>
      {manageName === "manage-users" && <ManageUser />}
      {manageName === "manage-games" && <ManageGame />}
    </Flex>
  );
}
