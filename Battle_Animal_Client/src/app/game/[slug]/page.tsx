import React from "react";
import GameScene from "./components/gamePage";
import { Box, Flex, Grid, Text } from "@radix-ui/themes";
import CardGameItem from "@/app/homepage/components/cardGameItem";

export default async function GamePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const gameName = (await params).slug;

  const games = [{ name: "BattleAnimal", imageUrl: "/images/game1.png" }];

  return (
    <Box className=" w-full h-full">
      <Flex direction={"column"} maxWidth={"1250px"} gap={"4"}>
        <Box>
          <Flex height={"665px"} className=" relative">
            <Box className=" absolute w-full h-full bg-slate-200 blur-sm"></Box>
            <GameScene />
          </Flex>
          <Flex
            p={"3"}
            direction={"column"}
            className=" bg-white rounded-b-md "
          >
            <Text className=" text-2xl font-bold">{gameName}</Text>
            <Text className=" ">1 ครั้งในการเล่น </Text>
          </Flex>
        </Box>
        <Flex
          className=" bg-white rounded-md"
          p={"4"}
          direction={"column"}
          gap={"2"}
        >
          <Text className=" font-bold">รายละเอียดเกม</Text>
          <Text>
            Get ready for a fast-paced adventure with Geometry Arrow! Your goal?
            Make it through a dangerous cave filled with deadly spikes and
            tricky obstacles. Each level gets harder, so you will need quick
            reflexes and perfect timing to avoid disaster. With six levels to
            conquer, the challenge is real—can you reach the portal and make it
            out alive? If you are into high-speed action and testing your
            skills, this game is for you. Jump in and see if you have what it
            takes to survive the cave! Enjoy playing this game here at Y8.com!
          </Text>
          <Text className=" text-[#999] ">
            หมวดหมู่: เกมอาร์เคดและคลาสสิค เพิ่มเมื่อ 12 Dec 2024
          </Text>
        </Flex>

        <Flex
          className=" bg-white rounded-md"
          p={"4"}
          direction={"column"}
          gap={"2"}
          minHeight={"120px"}
        >
          <Text className=" font-bold">ความคิดเห็น : 0</Text>
        </Flex>

        <Flex
          className=" bg-white rounded-md"
          p={"4"}
          direction={"column"}
          gap={"2"}
          minHeight={"120px"}
        >
          <Text className=" font-bold">เกมที่เกี่ยวข้อง</Text>
          <Grid
            columns={{
              initial: "2",
              xs: "3",
              md: "5",
              sm: "4",
              lg: "6",
              xl: "6",
            }}
            gap="3"
            width="100%"
            p={"4"}
          >
            {games.map((game) => (
              <CardGameItem
                key={game.name}
                name={game.name}
                imageUrl={game.imageUrl}
              />
            ))}
          </Grid>
        </Flex>
      </Flex>
    </Box>
  );
}
