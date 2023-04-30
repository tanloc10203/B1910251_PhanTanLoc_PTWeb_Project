import Cookies from "js-cookie";
import { io } from "socket.io-client";

const URL = process.env.VUE_APP_ENDPOINT_URL;

const socket = io(URL, {
  autoConnect: false,
  withCredentials: true,
  auth: {
    accessToken: localStorage.getItem("accessToken"),
  },
});

export default socket;
