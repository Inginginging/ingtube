import express from "express"; //node_modules에서 express import
import morgan from "morgan"; // morgan: external middleware
import session from "express-session" // session과 cookie저장을 가능하게 해주는 middleware
import flash from "express-flash"; //flash message를 띄우는 middleware
import MongoStore from "connect-mongo"; //session data를 mongodb에 저장하기 위해  mongostroe import

import rootRouter from "./routers/rootRouter";
import videoRouter from "./routers/videoRouter";
import userRouter from "./routers/userRouter";
import apiRouter from "./routers/apiRouter";
import { localsMiddleware } from "./middleware"; //server에 import함으로서 모든 template에서 local객체 사용 가능


const app = express(); //express를 사용해 app객체를 만듬. (express의 기능을 가진 app) 
const logger = morgan("dev");

app.set("view engine", "pug"); //express에 view engine으로 pug를 사용할 것을 알려줌
app.set("views", process.cwd() + "/src/views"); //express의 view 디폴트 값을 /src/views로 옮겨줌.


app.use((req, res, next) => {  //ffmpeg error를 위한 조치.
    res.header("Cross-Origin-Embedder-Policy", "require-corp");
    res.header("Cross-Origin-Opener-Policy", "same-origin");
    next();
    });

app.use(logger);//morgan middleware를 global하게 사용
app.use(express.urlencoded({ extended: true })); //form의 body를 express에 이해시키기 위한 메서드
app.use(express.json()); //backend에서 json을 자바스크립트 객체로 바꿔줌.
app.use(
    session({
        secret: process.env.COOKIE_SECRET,
        resave: false, //웹 사이트에 방문한 모든 사람에게 session을 제공하는 것이 아니라, session을 변경(로그인)한 사람에게만 session id 지급.
        saveUninitialized: false,
        store: MongoStore.create({ mongoUrl:process.env.DB_URL }), //나의 mongourl에 session 저장.
}));

app.use(flash());//flash middleware 사용.
app.use(localsMiddleware) //localmiddlware: pug template과 express간의 소통을 가틍하게 해주는 local object 사용.

app.use("/uploads", express.static("uploads")) //static은 브라우저에 노출시키고 싶은 폴더를 지정해주면 노출시켜줌.
app.use("/static", express.static("assets")) ///static url로 접근시 assets 폴더 보이게함. url은 base pug에서 사용.
app.use("/", rootRouter);
app.use("/videos", videoRouter);
app.use("/users", userRouter);
app.use("/api", apiRouter);


export default app;

