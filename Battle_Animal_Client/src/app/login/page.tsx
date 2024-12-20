import { Flex } from "@radix-ui/themes";
import LoginForm from "./components/loginForm";

export default async function LoginPage() {
  return (
    <Flex
      width={"100%"}
      height={"100%"}
      direction={"column"}
      align={"center"}
      justify={"between"}
      gap={"4"}
      className="rounded-lg "
    >
      <LoginForm logoURL={"/images/logo_game.png"} />
    </Flex>
  );
}
