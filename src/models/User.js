import bcrypt from "bcrypt";
import mongoose from "mongoose"

const userSchema = new mongoose.Schema({
    username: {type: String, required: true, unique: true,},
    avatarUrl: String,
    socialOnly: {type: Boolean, default: false},
    email: {type: String, required: true, unique: true,},
    password: {type: String,  },
    name: {type: String, required: true, },
    location: {type: String,},
})

userSchema.pre("save", async function(){ //password 저장 전 hash 암호화를 진행하는 middleware
    this.password = await bcrypt.hash(this.password, 5);
})

const User = mongoose.model("User", userSchema);

export default User;
