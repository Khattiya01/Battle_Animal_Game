import { Flex } from "@radix-ui/themes";
import Image from "next/image";
import React from "react";
import InputSearch from "../inputs/inputSearchNavbar";
import ButtonRegister from "../buttons/buttonRegister";
import ButtonLogin from "../buttons/buttonLogin";
import Link from "next/link";

const MainNavbar = async () => {
  return (
    <Flex
      justify={"center"}
      className=" h-[80px]"
      style={{
        boxShadow:
          "rgba(27, 31, 35, 0.04) 0px 1px 0px, rgba(255, 255, 255, 0.25) 0px 1px 0px inset",
      }}
    >
      <Link href={"/"} className="relative w-[160px] h-[80px] ">
        <Image
          src={"/images/logo_game.png"}
          alt="logo-main-website"
          layout="fill"
          objectFit="cover"
          priority
          className="hover:cursor-pointer hover:opacity-60 opacity-100 transition ease-in-out duration-300 "
        />
      </Link>
      <Flex align={"center"} gap={"4"}>
        <InputSearch />
        <ButtonRegister />
        <ButtonLogin />
      </Flex>
    </Flex>
  );
};

export default MainNavbar;
