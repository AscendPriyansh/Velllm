import "dotenv/config";
import app from "./app.js";
import { createServer } from "http";
import { initializeSocket } from "./sockets/index.js";

const PORT = process.env.PORT || 3000;

const httpServer = createServer(app);

initializeSocket(httpServer);

httpServer.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});