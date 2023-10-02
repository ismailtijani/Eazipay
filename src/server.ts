import http from "http";
import { app, PORT } from "./config/app";
// import  from "./environment";

http.createServer(app).listen(PORT, () => console.log(`Server is running 🚀🚀🚀 on port ${PORT}`));
