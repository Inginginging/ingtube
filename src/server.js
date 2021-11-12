import express from "express"; //node_modules에서 express import
import morgan from "morgan"; // morgan: external middleware

import globalRouter from "./routers/globalRouter";
import videoRouter from "./routers/videoRouter";
import userRouter from "./routers/userRouter";

const PORT = 4000;
const app = express(); //express를 사용해 app객체를 만듬. (express의 기능을 가진 app) 
const logger = morgan("dev");

app.use(logger);//morgan middleware를 global하게 사용

app.use("/", globalRouter);
app.use("/videos", videoRouter);
app.use("/users", userRouter);

const handleListening = () =>console.log(`Server listening on port http://localhost:${PORT} 🚀`);

app.listen(PORT,handleListening);
