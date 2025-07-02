"use client";

import { Avatar, Box, Flex, HoverCard, Text } from "@radix-ui/themes";
import React from "react";
import { FaCaretDown } from "react-icons/fa";
import { useSession } from "next-auth/react";
import { ROLE } from "@/types/role";
import ListMenuNavbarProfile from "./listMenuNavbarProfile";

const NavbarProfileInfo = () => {
  const { data: session } = useSession();

  return (
    <HoverCard.Root>
      <HoverCard.Trigger>
        <Flex className=" mr-8" align={"center"} gap={"4"}>
          <Box className=" relative">
            <Box className=" w-3 h-3 rounded-full bg-green-600 absolute border-white border-2 bottom-0 right-0"></Box>
            <Avatar
              src="/images/avatar2.png"
              fallback={"/images/avatar2.png"}
              size={"2"}
            />
          </Box>
          <Text>
            {session?.user.role === ROLE[0] && "ADMIN"}
            {session?.user.role === ROLE[1] && "USER"}
          </Text>
          <FaCaretDown />
        </Flex>
      </HoverCard.Trigger>
      <HoverCard.Content maxWidth="300px">
        <Flex gap={"2"} direction={"column"} width={"160px"}>
          <ListMenuNavbarProfile title={"ออกจากระบบ"} />
        </Flex>
      </HoverCard.Content>
    </HoverCard.Root>
  );
};
export default NavbarProfileInfo;
