import { client } from "./client";
import { statusRoom } from "./statusRoom";

export type room = {
  id: string;
  clients: client[];
  statusRoom: statusRoom;
  currentlyPlayingPlayerName: string | undefined;
  countdown: NodeJS.Timeout | undefined;
  windforce: number;
};
