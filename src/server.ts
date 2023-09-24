import "reflect-metadata";
import http from "http";
import { app, PORT } from "./config/app";

http.createServer(app).listen(PORT, () => console.log(`Server is running 🚀🚀🚀 on port ${PORT}`));
