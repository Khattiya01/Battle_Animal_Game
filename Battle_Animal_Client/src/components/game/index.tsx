"use client";

import React, { useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";

const MyGame = () => {
  // Initialize the socket connection
  // const [socket, setsocket] = useState<Socket | undefined>(undefined);
  const socketRef = useRef<Socket | null>(null);
  const [unityConnected, setUnityConnected] = useState("false");

  useEffect(() => {
    // Load Unity WebGL loader script
    const existingScript = document.querySelector(
      'script[src="/game/build/unitywebgl.loader.js"]'
    );

    if (!existingScript) {
      try {
        const script = document.createElement("script");
        script.src = "/game/build/unitywebgl.loader.js";
        script.async = true;
        document.body.appendChild(script);

        return () => {
          document.body.removeChild(script);
        };
      } catch (error) {
        console.error("Error loading Unity script:", error);
      }
    }
  }, []);

  useEffect(() => {
    if (socketRef.current) {
      const socket = socketRef.current;

      const handleMessage = (event: any) => {
        if (event.data.type === "GET_TOKEN") {
          console.log("GET_TOKEN");
          getTokenFromLocalStorage();
        }
        if (event.data.type === "SET_HAS_CONNECT_TO_WEB") {
          console.log("SET_HAS_CONNECT_TO_WEB");
          setHasConnectToWeb(event.data.value);
        }
        if (event.data.type === "GET_HAS_CONNECT_TO_WEB") {
          console.log("GET_HAS_CONNECT_TO_WEB");
          getHasConnectToWeb();
        }
        if (event.data.type === "CHANGE_SCENE") {
          console.log("CHANGE_SCENE", event.data.value);
          // setScene(event.data.roomId)
          // socket.emit("player-join-room", event.data.currentRoomId);
        }
        if (event.data.type === "PLAYER_JOINT_ROOM") {
          console.log("PLAYER_JOINT_ROOM", event.data.value);
          socket.emit("player-join-room", event.data.value);
          // patchUpdateUserJoinRoom({ id: event.data.value });
        }
        if (event.data.type === "PLAYER_PLAY") {
          console.log("PLAYER_PLAY", event.data.value);
          socket.emit("player-play", event.data.value);
        }
        if (event.data.type === "PLAYER_SHOOT") {
          console.log("PLAYER_SHOOT", event.data.value);
          socket.emit("player-shoot", event.data.value);
        }
        if (event.data.type === "PLAYER_DECREASE_HEALTH") {
          console.log("PLAYER_DECREASE_HEALTH", event.data.value);
          socket.emit("player-Decrease-health", event.data.value);
        }
        if (event.data.type === "PLAYER_LEAVE_ROOM") {
          console.log("PLAYER_LEAVE_ROOM", event.data.value);
          socket.emit("player-leave-room", event.data.value);
          // patchUpdateUserLeaveRoom({ id: event.data.value });
        }
      };

      window.addEventListener("message", handleMessage);
      return () => {
        window.removeEventListener("message", handleMessage);
      };
    }
  }, [socketRef.current]);

  useEffect(() => {
    console.log("socket is not connected", socketRef.current);

    if (!socketRef.current) {
      socketRef.current = io("http://localhost:8081"); // Replace with your server URL
      console.log("socket is connected", socketRef.current);
    }

    const socket = socketRef.current;

    socket.on("room-added", (response) => {
      console.log(" recv: room-added" + JSON.stringify(response));
      AddRoom(JSON.stringify(response));
    });

    socket.on("room-user-count-updated", (response) => {
      console.log(" recv: room-user-count-updated" + JSON.stringify(response));
      RoomUserCountUpdate(JSON.stringify(response));
    });

    socket.on("player-join-room", (response) => {
      console.log(" recv: player-join-room" + JSON.stringify(response));
      PlayerJoinRoom(JSON.stringify(response));
    });

    socket.on("other-player-joined", (response) => {
      console.log(" recv: other-player-joined" + JSON.stringify(response));
      OtherPlayerJointed(JSON.stringify(response));
    });

    socket.on("player-shoot", (response) => {
      console.log(" recv: player-shoot" + JSON.stringify(response));
      PlayerShoot(JSON.stringify(response));
    });

    socket.on("player-Decrease-health", (response) => {
      console.log(" recv: player-Decrease-health" + JSON.stringify(response));
      PlayerDecreaseHealth(JSON.stringify(response));
    });

    socket.on("other-player-disconnected", (response) => {
      console.log(
        " recv: other-player-disconnected" + JSON.stringify(response)
      );
      OtherPlayerDisconnected(JSON.stringify(response));
    });

    socket.on("change-status-room", (response) => {
      console.log(
        " recv: change-status-room" + JSON.stringify(response)
      );
      ChangeStatusRoom(JSON.stringify(response));
    });

    return () => {
      // ทำการ cleanup listeners ตอนที่ component ถูก unmount
      socket.off("room-added");
      socket.off("room-user-count-updated");
      socket.off("player-join-room");
      socket.off("other-player-joined");
      socket.off("player-shoot");
      socket.off("player-Decrease-health");
      socket.off("other-player-disconnected");
      socket.off("change-status-room");
    };
  }, []);

  const AddRoom = (value: string) => {
    const iframe = document.querySelector("iframe");
    if (iframe) {
      iframe.contentWindow?.postMessage(
        { type: "ADD_ROOM", value: value },
        "*"
      );
    }
  };

  const RoomUserCountUpdate = (value: string) => {
    const iframe = document.querySelector("iframe");
    if (iframe) {
      iframe.contentWindow?.postMessage(
        { type: "ROOM_USER_COUNT_UPDATE", value: value },
        "*"
      );
    }
  };

  const PlayerJoinRoom = (value: string) => {
    console.log("value", value);
    const iframe = document.querySelector("iframe");
    if (iframe) {
      iframe.contentWindow?.postMessage(
        { type: "PLAYER_JOINT_ROOM", value: value },
        "*"
      );
    }
  };

  const OtherPlayerJointed = (value: string) => {
    const iframe = document.querySelector("iframe");
    if (iframe) {
      iframe.contentWindow?.postMessage(
        { type: "OTHER_PLAYER_JOINTED", value: value },
        "*"
      );
    }
  };

  const PlayerShoot = (value: string) => {
    const iframe = document.querySelector("iframe");
    if (iframe) {
      iframe.contentWindow?.postMessage(
        { type: "PLAYER_SHOOT", value: value },
        "*"
      );
    }
  };

  const OtherPlayerDisconnected = (value: string) => {
    const iframe = document.querySelector("iframe");
    if (iframe) {
      iframe.contentWindow?.postMessage(
        { type: "OTHER_PLAYER_DISCONNECTED", value: value },
        "*"
      );
    }
  };

  const PlayerDecreaseHealth = (value: string) => {
    const iframe = document.querySelector("iframe");
    if (iframe) {
      iframe.contentWindow?.postMessage(
        { type: "PLAYER_DECREASE_HEALTH", value: value },
        "*"
      );
    }
  };

  const getTokenFromLocalStorage = () => {
    const token = localStorage.getItem("token");
    const iframe = document.querySelector("iframe");
    if (iframe) {
      iframe.contentWindow?.postMessage(
        { type: "GET_TOKEN", value: token },
        "*"
      );
    }
  };

  const setHasConnectToWeb = (connected: string) => {
    setUnityConnected(connected);
  };

  const getHasConnectToWeb = () => {
    const iframe = document.querySelector("iframe");
    if (iframe) {
      iframe.contentWindow?.postMessage(
        { type: "GET_HAS_CONNECT_TO_WEB", value: unityConnected },
        "*"
      );
    }
  };

  const ChangeStatusRoom = (value: string) => {
    const iframe = document.querySelector("iframe");
    if (iframe) {
      iframe.contentWindow?.postMessage(
        { type: "CHANGE_STATUS_ROOM", value: value },
        "*"
      );
    }
  };

  return (
    <div className="w-screen h-screen relative">
      <iframe
        src="/game/index.html"
        width="100%"
        height="90%"
        style={{
          border: "none",
          position: "absolute",
          top: "0",
          left: "0",
          right: "0",
          bottom: "0",
        }}
        allowFullScreen
        title="Unity Game"
      ></iframe>
      <button
        onClick={() => {
          // if (socketRef.current?.connected) {
          //   socketRef.current.emit("test-room", "test rooooooom");
          // }
          console.log("player-shoot");
          PlayerShoot(JSON.stringify("player-shoot"));
        }}
        className=" absolute bottom-0"
      >
        test send to socket
      </button>
    </div>
  );
};

export default MyGame;
