import { Flex, Text } from "@radix-ui/themes";
import React from "react";

const MainFooter = async () => {
  return (
    <Flex direction={"column"}>
      {/* <Flex justify={"center"} className=" bg-main  text-white text-[12px]">
        <Grid
          px={"8"}
          columns={{ sm: "2", md: "3" }}
          width="auto"
          className=" max-w-desktop"
          p={"3"}
          gap={"6"}
        >
 

        </Grid>
      </Flex> */}
      <Flex
        justify={"center"}
        pt={"2"}
        pb={"2"}
        className=" bg-main text-white"
      >
        <Text className=" sm:text-sm text-[12px]">
          © Copyright 2024 by gang roog jiab.com
        </Text>
      </Flex>
    </Flex>
  );
};

export default MainFooter;
