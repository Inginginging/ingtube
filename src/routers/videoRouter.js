import express from "express";
import { getEdit, watch, postEdit, getUpload, postUpload, deleteVideo } from "../controller/videoController";
import { protectorMiddleware, videoUpload } from "../middleware";

const videoRouter = express.Router();

videoRouter.get("/:id([0-9a-f]{24})", watch);  //mongoose에서 id가 16진수로 표현되므로 hexadomical regular expression 사용
videoRouter.route("/:id([0-9a-f]{24})/edit").all(protectorMiddleware).get(getEdit).post(postEdit); //login사용자만 video edit 가능
videoRouter.route("/:id([0-9a-f]{24})/delete").all(protectorMiddleware).get(deleteVideo); 
videoRouter.route("/upload").all(protectorMiddleware).get(getUpload).post(videoUpload.fields([{name: "video"}, {name: "thumbnail"}]),postUpload);//upload middleware 사용 .. "video"는 input의 name

export default videoRouter;