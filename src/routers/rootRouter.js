import express from "express";
import { home, search } from "../controller/videoController";
import { getJoin, postJoin, getLogin, postLogin } from "../controller/userController";
import { publicOnlyMuddleware } from "../middleware";

const rootRouter = express.Router();

rootRouter.get("/",home);
rootRouter.route("/join").all(publicOnlyMuddleware).get(getJoin).post(postJoin);
rootRouter.route("/login").all(publicOnlyMuddleware).get(getLogin).post(postLogin);
rootRouter.get("/search", search);


export default rootRouter;