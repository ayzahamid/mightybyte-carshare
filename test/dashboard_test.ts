import { io } from "socket.io-client";
const socket = io("ws://localhost:3000/dashboard");

socket.on("connect", () => {
  console.log("Dashboard connected!");

  socket.emit("subscribe_driver", { username: "driver1" });

  socket.on("subscribed", (data: any) => {
    console.log("Subscribed to:", data.username);
  });

  socket.on("location", (data: any) => {
    console.log("Live location:", data);
  });

  socket.on("error", (msg: any) => {
    if (msg.errorCode === "OFFLINE_DRIVER") {
      console.log("Driver is offline:", msg);
    } else {
      console.log("Other error:", msg);
    }
  });
});

socket.on("disconnect", () => {
  console.log("Dashboard socket disconnected.");
});
