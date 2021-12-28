import mongoose from "mongoose"

const commentSchema = new mongoose.Schema({
    text: { type: String, required: true,  },
    owner: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "User"}, //commnet 입력자.
    video: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "Video"}, //comment를 단 video
    createdAt: {type: Date, required: true, default: Date.now },
})

const Comment = mongoose.model("Comment", commentSchema);

export default Comment;