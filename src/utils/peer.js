import Peer from "simple-peer";

export const createPeer = (initiator, socket) => {
  const peer = new Peer({
    initiator,
    trickle: false,
  });

  peer.on("signal", (data) => {
    socket.send(JSON.stringify({
      type: "signal",
      signal: data
    }));    
  });

  return peer;
};