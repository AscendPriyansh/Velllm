import { io } from "socket.io-client";

const socket = io("http://localhost:3000", {
    auth: {
        token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJiM2I3YmUwNS00MDViLTQxYTEtYjljNy00Nzk5ZWNhYjEwM2YiLCJ1c2VybmFtZSI6InVzZXIzIiwiZW1haWwiOiJ1c2VyM0BnbWFpbC5jb20iLCJpYXQiOjE3OTA1MzQ2NjEsImV4cCI6MTc5MTEzOTQ2MX0.Ok9aT6Pc38NZBsZN4t_HtdefpKmtm_OGzHrHVrSYDiA"
    }
});

socket.on("connect", () => {
    console.log("Connected:", socket.id);
});

socket.on("connect_error", (err) => {
    console.log("Connection failed:", err.message);
});