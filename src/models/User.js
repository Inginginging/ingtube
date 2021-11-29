import bcrypt from "bcrypt";
import mongoose from "mongoose"

const userSchema = new mongoose.Schema({
    username: {type: String, required: true, unique: true,},
    avatarUrl: String,
    socialOnly: {type: Boolean, default: false},
    email: {type: String, required: true, unique: true,},
    password: {type: String, minlength: 8 },
    name: {type: String, required: true, },
    location: {type: String,},
    videos: [{type: mongoose.Schema.Types.ObjectId, ref: "Video"}] //db에 저장된 Video정보로 부터 objectId를 가져와 user의 video 설정..video를 업로드 가능하므로 array로 설정.
})

userSchema.pre("save", async function(){ //password 저장 전 hash 암호화를 진행하는 middleware
    if(this.isModified("password")){//password가 변경되었을 때만 hash 암호화 진행.
        this.password = await bcrypt.hash(this.password, 5);
    }
})   

const User = mongoose.model("User", userSchema);

export default User;
