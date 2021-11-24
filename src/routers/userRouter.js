import express from "express";
import { edit, see, logout, startGithubLogin, finishGithubLogin} from "../controller/userController";
const userRouter = express.Router();

userRouter.get("/:id(\\d+)", see);
userRouter.get("/logout",logout);
userRouter.get("/github/start", startGithubLogin); //github page로 redirect됨.
userRouter.get("/github/finish", finishGithubLogin); //github page에서 redirect됨.
userRouter.get("/edit",edit);


export default userRouter;