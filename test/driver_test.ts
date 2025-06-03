import { io } from "socket.io-client";
const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImRyaXZlcjEiLCJpYXQiOjE3NDg5Njc1MDgsImV4cCI6MTc0ODk2NzgwOH0.f16VlBlfCu9MeCNpIYBkVFAkOtzUD4cXD0C_56tPoxw"

const socket = io("ws://localhost:3000/driver");
socket.on("connect", () => {
  console.log("Connected as driver!");

  socket.emit("auth_driver", { token });

  socket.on("auth_ok", () => {
    console.log("Authenticated!");

    setInterval(() => {
      const lat = 40.7128 + Math.random() * 0.01;
      const long = -74.0060 + Math.random() * 0.01;
      socket.emit("location_update", { lat, long });
      console.log("Sent location update:", lat, long);
    }, 5000);
  });

  socket.on("error", (msg: any) => {
    console.log("Driver error:", msg);
    socket.disconnect();
  });
});

socket.on("disconnect", () => {
  console.log("Driver socket disconnected.");
});
