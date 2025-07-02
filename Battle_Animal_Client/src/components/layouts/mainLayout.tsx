import React from "react";
import { Box, Flex } from "@radix-ui/themes";
import MainNavbar from "../navbars/mainNavbar";
import MainFooter from "../footers/mainFooter";

const MainLayout = async ({ children }: { children: React.ReactNode }) => {
  return (
    <div className=" ">
      <MainNavbar />
      <Flex className=" w-full h-full  bg-[#f1f1f1]" justify={"center"}>
        <Box
          className=" w-full max-w-[1590px] min-h-screen"
          position={"relative"}
        >
          {children}
        </Box>
      </Flex>

      <MainFooter />
    </div>
  );
};

export default MainLayout;
