import { env } from '../envConfig';
import axios from 'axios';

const MAINURL = `http://${env.HOST}:${env.PORT}`;

export const getMessageByRoomId = (props: { config: any; roomId: string }) => {
  return axios.get(MAINURL + '/v1/room/get' + `/${props.roomId}`, props.config);
};
