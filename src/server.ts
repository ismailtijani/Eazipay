import http from "http";
import { app } from "./config/app";
import { PORT } from "./environment";

http.createServer(app).listen(PORT, () => console.log(`Server is running 🚀🚀🚀 on port ${PORT}`));
