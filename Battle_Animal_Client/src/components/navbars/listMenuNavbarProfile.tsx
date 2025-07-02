"use client";

import { Flex, Text } from "@radix-ui/themes";
import { signOut } from "next-auth/react";
import React from "react";
import { IoIosLogOut } from "react-icons/io";

const ListMenuNavbarProfile = ({ title }: { title: string }) => {
  const handleLogout = async () => {
    await signOut();
  };
  return (
    <Flex
      className=" hover:text-blue-500 cursor-pointer"
      gap={"4"}
      align={"center"}
      onClick={handleLogout}
    >
      <IoIosLogOut size={"24px"} /> <Text>{title}</Text>
    </Flex>
  );
};

export default ListMenuNavbarProfile;
