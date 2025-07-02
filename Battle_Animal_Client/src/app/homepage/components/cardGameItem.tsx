import { Flex, Text } from "@radix-ui/themes";
import Link from "next/link";
import React from "react";

type CardGameItemProps = {
  name: string;
  imageUrl: string;
};
const CardGameItem = (props: CardGameItemProps) => {
  const { name, imageUrl } = props;
  return (
    <Link
      href={`/game/${name}`}
      className=" group w-[154px] h-[154px] relative"
    >
      <video
        id="background-video"
        autoPlay
        loop
        muted
        poster={imageUrl}
        className="absolute top-0 left-0 w-full h-full object-cover hidden group-hover:block rounded-md"
      >
        <source
          src={`https://www.thaipedigree.com/static/game/gojo-ultimate-skill3.mp4`}
          // src={`${process.env.NEXT_PUBLIC_API_URL}/v1/stream-video/gojo-ultimate-skill3.mp4`}
          type="video/mp4"
        />
      </video>
      <Flex
        gap="3"
        align="center"
        height={"154px"}
        width={"154px"}
        className="hover:scale-110 duration-300 cursor-pointer rounded-md  relative group-hover:hidden"
        style={{
          backgroundImage: `url(${imageUrl})`,
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center",
          backgroundSize: "cover",
        }}
      ></Flex>
      <Text className=" absolute bottom-2 left-2 group-hover:opacity-100 opacity-0 duration-300 text-white">
        {name}
      </Text>
    </Link>
  );
};

export default CardGameItem;
