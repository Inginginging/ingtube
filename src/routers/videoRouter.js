import express from "express";
import { getEdit, watch, postEdit, getUpload, postUpload, deleteVideo } from "../controller/videoController";

const videoRouter = express.Router();

videoRouter.get("/:id([0-9a-f]{24})", watch);  //mongoose에서 id가 16진수로 표현되므로 hexadomical regular expression 사용
videoRouter.route("/:id([0-9a-f]{24})/edit").get(getEdit).post(postEdit);
videoRouter.route("/:id([0-9a-f]{24})/delete").get(deleteVideo);
videoRouter.route("/upload").get(getUpload).post(postUpload);

export default videoRouter;