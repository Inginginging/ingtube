import mongoose from "mongoose";

const videoSchema = new mongoose.Schema({
    title: {type: String, required: true, trim:true, maxlength: 70},
    fileUrl: {type: String, required: true},
    thumbUrl: {type: String, required: true},
    description: {type: String, required: true, trim:true, minlength: 1},
    createdAt: {type: Date, required: true, default: Date.now }, //default 값을 설정하면 data create 시 생략해도 오류 없음.  
    hashtags: [{type:String, trim:true, }],
    meta:{
        views: {type: Number, required: true, default: 0},
    },
    comments: [{type: mongoose.Schema.Types.ObjectId, ref: "Comment"}],
    owner: {type: mongoose.Schema.Types.ObjectId, required: true, ref: "User"} //db에 저장된 User정보로 부터 objectId를 가져와 video의 owner 설정.
});

/* //pre middleware는 findByIdAndUpdate에서는 사용 불가능 하므로 다른 방법 사용.
//video model을 save'메소드' 하기 전에 hashtag에 대한 조치를 먼저 하게 해주는 mongoose의 middleware
videoSchema.pre("save", async function(){
    this.hashtags = this.hashtags[0].split(",").map((word)=>word.startsWith("#") ? word : `#${word}`);
})
*/

videoSchema.static("formatHashtags",function(hashtags){ //static을 사용하면 Video model의 메서드를 직접 만들 수 았음.
    return hashtags.split(",").map((word)=>word.startsWith("#") ? word : `#${word}`);
});

const Video = mongoose.model("Video", videoSchema);
export default Video;