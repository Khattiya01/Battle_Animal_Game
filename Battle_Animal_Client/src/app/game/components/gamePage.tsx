'use client'

import dynamic from "next/dynamic";
import React from "react";

const MyGame = dynamic(() => import("@/components/game"), { ssr: false });

const GameScene = () => {

  return (
    <div>
      <MyGame />
    </div>
  );
};

export default GameScene;
