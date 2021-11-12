import express from "express";
import { recommended, search } from "../controller/videoController";
import { join, login } from "../controller/userController";

const globalRouter = express.Router();

globalRouter.get("/",recommended);
globalRouter.get("/join", join);
globalRouter.get("/login", login);
globalRouter.get("/search", search);

export default globalRouter;