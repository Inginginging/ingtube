import express from "express";
import { getEdit, postEdit , see, logout, startGithubLogin, finishGithubLogin, getChangePw, postChangePw} from "../controller/userController";
import { protectorMiddleware, publicOnlyMuddleware, avatarUpload } from "../middleware";
const userRouter = express.Router();

userRouter.get("/:id([0-9a-f]{24})", see);
userRouter.get("/logout",protectorMiddleware,logout);
userRouter.get("/github/start", publicOnlyMuddleware ,startGithubLogin); //github page로 redirect됨.
userRouter.get("/github/finish", publicOnlyMuddleware ,finishGithubLogin); //github page에서 redirect됨.
userRouter.route("/edit").all(protectorMiddleware).get(getEdit).post(avatarUpload.single("avatar"), postEdit); //upload middleware 사용 .. "avatar"는 input의 name
userRouter.route("/change-password").all(protectorMiddleware).get(getChangePw).post(postChangePw);

export default userRouter;