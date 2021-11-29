import User from "../models/User";
import Video from "../models/Video";
import bcrypt from "bcrypt";
import fetch from "node-fetch" //node 에서는 fetch 이해를 못하므로 node-fetch 설치 후 import

export const getJoin = (req,res) => res.render("user/join", {pageTitle: "Join"});

export const postJoin = async(req,res) =>{
    const {name, username, email, password, password2, location} = req.body;
    if(password != password2){ //password의 확인 여부 확인
        return res.status(400).render("user/join", {pageTitle: "Join", errorMessage: "The password confirmation failed"});
    }
    const exists = await User.exists({ $or: [ {username}, {email} ]} );//User db안에 중복되는 username과 email의 존재 여부 확인 
    if(exists){
        return res.status(400).render("user/join", {pageTitle: "Join", errorMessage: "This Username/Email is already taken"});
    }
    try{ //그외의 오류들을 잡기 위해 예외 처리 구문 사용.
        await User.create({
            name, //===name:name
            username,
            email,
            password,
            location,
        });
        return res.redirect("/login")
    }catch(error){
        return res.render("user/join", {pageTitle: "Join",  errorMessage: error._message});
    }
};

export const getLogin = (req,res) =>res.render("user/login", {pageTitle: "Login"});

export const postLogin = async(req, res) =>{
    const {username, password} = req.body;
    const user = await User.findOne({username, socialOnly:false}) //db에서 req.body의 username과 db안의 username이 같은것이 있는지 확인
    if(!user){ //username이 db안에 등록되어 있지 않을때.
        return res.status(400).render("user/login", {pageTitle: "Login", errorMessage: "No such Username"});
    }
    const ok = await bcrypt.compare(password, user.password); //rep.body로 부터 받은 password와 db안의 password가 같은지 확인
    if(!ok){
        return res.status(400).render("user/login", {pageTitle: "Login", errorMessage: "Wrong password"});
    }
    req.session.loggedIn = true; //req.session 객체에 loggedIn 프로퍼티 추가 후 값을. true로 설정
    req.session.user = user; //req.session 객체에 로그인하려는 user의 정보 프로퍼티로 추가.
    return res.redirect("/")
}

export const startGithubLogin = (req,res) => {
    const baseUrl = "https://github.com/login/oauth/authorize";
    const config = {
        client_id: process.env.GH_CLIENT,
        allow_signup: false, //github 회원가입은 못하게함. github 회원가입은 github 홈페이지로 가서 하시오.
        scope: 'read:user user:email',
    }
    const params = new URLSearchParams(config).toString();
    const finalUrl = `${baseUrl}?${params}`; //redirect할 chlwhd url
    return res.redirect(finalUrl);
}

export const finishGithubLogin = async(req,res) =>{
    const baseUrl = "https://github.com/login/oauth/access_token";
    const config = {
        client_id: process.env.GH_CLIENT,
        client_secret: process.env.GH_SECRET,
        code: req.query.code, //code: scope에 적은 정보에 접근할 수 있게 github에서 제공 해주는 code
    };
    const params = new URLSearchParams(config).toString();
    const finalUrl = `${baseUrl}?${params}`;
    const tokenRequest = await(await fetch(finalUrl,{
        method: "POST",
        headers: {
            Accept: "application/json"
            },
        })
    ).json(); //finalUrl에 post함으로써 json형식의 객체 받음. 안에는 token, token type, scope이 있음.
    if ("access_token" in tokenRequest) {
        const { access_token } = tokenRequest; 
        const apiUrl = "https://api.github.com";
        const userData = await(
            await fetch(`${apiUrl}/user`,{
                headers: {
                    Authorization: `token ${access_token}`, //access_token: code를 access_token으로 변경시킨것
                    }
                })
            ).json();
        const emailData = await(
            await fetch(`${apiUrl}/user/emails`,{
                headers: {
                    Authorization: `token ${access_token}`, 
                    }
                })
            ).json();
        const emailObj = emailData.find(
            (email) => email.primary === true && email.verified === true
        );
        if(!emailObj){ //email은 필수 조건이므로. 이메일이 없으면 로그인할수 없음.
            //set notification
            return res.redirect("/login") 
        }
        let user = await User.findOne({emial: emailObj.email}) //db에서 기존에 등록된 email과 github login email이 같은것이 있는지 확인
        if(!user){ //기존 사용자가 아닐때
            user = await User.create({
                name: userData.name, //===name:name
                username: userData.login,
                socialOnly: true,
                avatarUrl: userData.avatar_url, 
                email: emailObj.email,
                password: "",
                location: userData.location,
                })
            };  
        req.session.loggedIn = true; 
        req.session.user = user; 
        return res.redirect("/")
    }else{
        return res.redirect("/login")
    }
}

export const logout = (req,res) => {
    req.session.destroy();
    res.redirect("/")
};

export const getEdit = (req,res) => res.render("user/edit-profile", {pageTitle: "Edit Profile"});

export const postEdit = async (req,res) =>{
    const { _id, avatarUrl} = req.session.user; //login했을때 req.session안에 user정보를 집어넣어 놧음.
    const { name, username, email, location } = req.body;
    const user = await User.findById(_id); //edit 하기 전의 user
    const file = req.file; //router에서 uploadfile middleware를 사용함으로서 req.file 사용 가능.
    if(username != user.username){ //username이 변경되었을때
        const exists = await User.findOne({username}) //db에 중복되는 username이 있는지 확인
        if(exists){
            return res.status(400).render("user/edit-profile", {pageTitle: "Edit Profile", errorMessage:"The Username already taken"});
        }
    }
    if(email != user.email){ //email이 변경되었을때
        const exists = await User.findOne({email}) //db에 중복되는 emial이 있는지 확인
        if(exists){
            return res.status(400).render("user/edit-profile", {pageTitle: "Edit Profile", errorMessage:"Someone alreay using the Email"});
        }
    }
    const updatedUser = await User.findByIdAndUpdate( _id, {
        avatarUrl: file ? file.path : avatarUrl, //file이 변경 되엇으면 file경로의 file로 avatarUrl 바꿈. 아니면 기존의 avatarUrl유지.
        name,
        username,
        email,
        location,
    }, {new: true}) //new:true를 해주므로서 update상태 유지(?)
    req.session.user = updatedUser; //req.session의 user를 updateduser로 교환
    return res.redirect("/users/edit");
}

export const getChangePw = (req,res) => res.render("user/changePw", {pageTitle: "Change Password"});

export const postChangePw = async(req,res) => {
    const { _id } = req.session.user;
    const { oldPw, newPw, newPw1 } = req.body;
    const user = await User.findById(_id);
    const ok = await bcrypt.compare(oldPw , user.password);
    if(!ok){ //db에 저장된 pw와 form에 기입한 pw가  다를떄
        return res.status(400).render("user/changePw", {pageTitle: "Change Password", errorMessage: "The current Password is Incorrect"});
    }
    if(newPw != newPw1){
        return res.status(400).render("user/changePw", {pageTitle: "Change Password", errorMessage: "Password Confirmation Failed"});
    }
    user.password = newPw;
    await user.save(); //save 하면 model에서 설정한 pre middleware가 작동하여 hash해줌
    return res.redirect("/users/logout")
}

export const see = async(req,res) =>{
    const {id} = req.params; //profile page는 모두가 볼 수 있으므로 user session에서 받아오는것이 아니라 url에서 받아와야됨.
    const user = await User.findById(id).populate("videos");//mongoose의 populate메서드는 model의 videos안에 있는 ref로 부터 video'객체'정보를 찾아옴.
    if(!user){
        return res.status(404).render("404", {pageTitle: "Cannot find User"});
    }
    //const videos = await Video.find({owner: user._id});
    return res.render("user/profile", {pageTitle: user.username, user,});
}
