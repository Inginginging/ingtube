import Video from "../models/Video";
import User from "../models/User";

export const home = async(req, res) =>{ 
    const videos= await Video.find({}).sort({createdAt: "desc" }).populate("owner"); //await을 사용하여 js에서 db와 통신하도록 기다려줌. 통신 후에 아래 코드 실행, desc을 통해 생성순서대로 내림차순 정렬.
    res.render("home", {pageTitle: "Home", videos});
}

export const getUpload = (req,res) =>{
    return res.render("video/upload", {pageTitle: "Upload Video"})
}
export const postUpload = async(req,res) =>{
    const {_id} = req.session.user; //session에 login돼있는 user로 부터 _id 가져옴.
    const {title, description, hashtags} = req.body;
    const {video, thumbnail} = req.files; //router에서 videoUpload middleware를 사용하므로 req.files사용 가능.
    try{
        const newVideo = await Video.create({ //db에 자동으로 save 해줌.
        title, //===title:title
        fileUrl: video[0].path,
        thumbUrl: thumbnail[0].path,
        description,
        createdAt: new Date().toLocaleString(),
        owner: _id, //owner에 id 저장.
        hashtags: Video.formatHashtags(hashtags),  //static 사용,
     });
        const user = await User.findById(_id);
        user.videos.push(newVideo._id); //user의 videos 배열 정보 안에 newVideo의 id 저장.
        user.save();
        return res.redirect("/");
    }catch(error){
        req.flash("error",error._message);
        return res.render("video/upload", {pageTitle: "Upload Video",});
    }
}

export const watch = async(req, res) => {
    const {id} = req.params; // === const id = req.params.id;, get method로 query에 쓰인 id 저장
    const video = await Video.findById(id).populate("owner");//mongoose의 populate메서드는 model의 owner안에 있는 ref로 부터 user'객체'정보를 찾아옴.
    //const owner = await User.findById(video.owner); //user model에서 video.owner의 id와 같은 id를 가진 user 객체 정보 찾아옴.
    if(!video){
        req.flash("error", "Video Not Found");
        return res.status(404).render("404", {pageTitle: "Error: Video Not Found"})
    }
    return res.render("video/watch", {pageTitle: video.title, video,});
}; 

export const getEdit = async(req, res) =>{
    const {id} = req.params; //video의 id
    const video = await Video.findById(id);
    const {_id} = req.session.user;//login돼있는 user의 id
    if(!video){
        req.flash("error", "Video Not Found");
        return res.status(404).render("404", {pageTitle: "Error: Video Not Found"})
    }
    if(String(video.owner) !== String(_id)){ //video의 owner id와 현재 로그인 돼있는 user의 id가 다를경우 video edit불가능
        req.flash("error","Not Authorized");
        return res.status(403).redirect("/");
    }
    return res.render("video/edit",{pageTitle: `Editing: ${video.title}`, video, })
}

export const postEdit = async(req, res) =>{
    const {id} = req.params; //query로 부터 받아드리는 video정보
    const {_id} = req.session.user;//login돼있는 user의 id
    const {title, description, hashtags} = req.body; //template의 form의 name으로부터 받아드리는 정보
    const video = await Video.exists({_id:id}); 
    if(!video){
        return res.render("404", {pageTitle: "Error: Video Not Found"})
    }
    if(String(video.owner) !== String(_id)){ //video의 owner id와 현재 로그인 돼있는 user의 id가 다를경우 video edit불가능
        req.flash("error", "You are not the Owner of the Video");
        return res.status(403).redirect("/");
    }
    await Video.findByIdAndUpdate(id,{
        title,
        description,
        hashtags: Video.formatHashtags(hashtags), //static 사용
    })
    req.flash("info", "The Video updated")
    return res.redirect(`/videos/${id}`);
}

export const deleteVideo = async(req,res) =>{
    const {id} = req.params;
    const video = await Video.findById(id);
    const {_id} = req.session.user;//login돼있는 user의 id
    if(String(video.owner) !== String(_id)){ //video의 owner id와 현재 로그인 돼있는 user의 id가 다를경우 video delete 불가능
        req.flash("error","Not Authorized");
        return res.status(403).redirect("/");
    }
    if(!video){
        req.flash("error","NO Such Video");
        return res.render("404", {pageTitle: "Error: Video Not Found"})
    }
    await Video.findByIdAndDelete(id);
    return res.redirect("/")
}

export const search = async(req,res) =>{
    const { keyword } = req.query; //template에서 name=keyword가 url의 query로 들어가 변수로 받을 수 있게 됨.
    let videos = [];
    if(keyword){ //search input에 무엇인가 써서 search를 했다면.
        videos = await Video.find({
            title: { $regex: new RegExp(`${keyword}`,"i") } , //keyword가 포함된 title을 찾는 regexp 사용
        }).sort({createdAt:"desc"}).populate("owner");
    }
    return res.render("video/search", {pageTitle: "Search", videos});
}

export const registerView = async(req, res) => { //어떠한 템플릿을 return하지 않음. post해도 그냥 그 url그대로 유지.
    const {id} = req.params;
    const video = await Video.findById(id);
    if(!video){
        return res.sendStatus(404);
    }
    video.meta.views = video.meta.views + 1;
    await video.save();
    return res.sendStatus(200);
}