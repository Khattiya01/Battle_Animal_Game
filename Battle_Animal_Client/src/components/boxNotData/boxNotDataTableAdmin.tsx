import { Flex, Text } from "@radix-ui/themes";
import React from "react";
import { BsClipboardData } from "react-icons/bs";

const BoxNotDataTableAdmin = () => {
  return (
    <Flex
      justify={"center"}
      align={"center"}
      direction={"column"}
      gap={"4"}
      className=" h-[260px] w-full text-[#00337d]"
    >
      <BsClipboardData
        style={{
          width: "64px",
          height: "64px",
          color: "#00337d",
          opacity: "0.75",
        }}
      />
      <Text className=" text-sm  text-[#00337d]"> ไม่มีข้อมูล </Text>
    </Flex>
  );
};

export default BoxNotDataTableAdmin;
