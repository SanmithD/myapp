import Peer from "simple-peer";

export const createPeer = (initiator, socket, room) => {
  const peer = new Peer({
    initiator,
    trickle: false,
  });

  peer.on("signal", (data) => {
    socket.send(JSON.stringify({ type: "signal", signal: data, room }));
  });

  peer.on("connect", () => console.log("[peer] data channel open"));
  peer.on("error", (err) => console.error("[peer] error:", err));
  peer.on("close", () => console.log("[peer] connection closed"));

  return peer;
};