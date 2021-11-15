import express from "express"; //node_modules에서 express import
import morgan from "morgan"; // morgan: external middleware

import globalRouter from "./routers/globalRouter";
import videoRouter from "./routers/videoRouter";
import userRouter from "./routers/userRouter";

const PORT = 4000;
const app = express(); //express를 사용해 app객체를 만듬. (express의 기능을 가진 app) 
const logger = morgan("dev");

app.set("view engine", "pug"); //express에 view engine으로 pug를 사용할 것을 알려줌
app.set("views", process.cwd() + "/src/views"); //express의 view 디폴트 값을 /src/views로 옮겨줌.

app.use(logger);//morgan middleware를 global하게 사용
app.use(express.urlencoded({ extended: true })); //form의 body를 express에 이해시키기 위한 메서드

app.use("/", globalRouter);
app.use("/videos", videoRouter);
app.use("/users", userRouter);

const handleListening = () =>console.log(`Server listening on port http://localhost:${PORT} 🚀`);

app.listen(PORT,handleListening);
