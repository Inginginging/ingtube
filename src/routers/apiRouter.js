import express from "express";
import { registerView, registerComment, deleteComment } from "../controller/videoController";

const apiRouter = express.Router();

apiRouter.post("/videos/:id([0-9a-f]{24})/view", registerView);
apiRouter.post("/videos/:id([0-9a-f]{24})/comment", registerComment);
apiRouter.delete("/comments/:id([0-9a-f]{24})", deleteComment);


export default apiRouter;