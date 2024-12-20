"use client";

import { Flex } from "@radix-ui/themes";
import dynamic from "next/dynamic";

const LoginForm = dynamic(() => import("./components/loginForm"), {
  ssr: false,
});

export default function LoginPage() {
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
