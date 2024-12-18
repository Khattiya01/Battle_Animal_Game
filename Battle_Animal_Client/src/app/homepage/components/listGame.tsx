import { Grid } from "@radix-ui/themes";
import React from "react";
import CardGameItem from "./cardGameItem";

const ListGame = () => {
  const games = [{ name: "BattleAnimal", imageUrl: "/images/game1.png" }];
  return (
    <Grid
      columns={{ initial: "2", xs: "3", md: "5", sm: "4", lg: "6", xl: "6" }}
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
  );
};

export default ListGame;
