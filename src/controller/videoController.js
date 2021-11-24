import Video from "../models/Video";

export const home = async(req, res) =>{ 
    const videos= await Video.find({}).sort({createdAt: "desc" }); //await을 사용하여 js에서 db와 통신하도록 기다려줌. 통신 후에 아래 코드 실행, desc을 통해 생성순서대로 내림차순 정렬.
    res.render("home", {pageTitle: "Home", videos});
}

export const getUpload = (req,res) =>{
    return res.render("Upload", {pageTitle: "Upload Video"})
}
export const postUpload = async(req,res) =>{
    const {title, description, hashtags} = req.body;
    try{
        await Video.create({ //db에 자동으로 save 해줌.
        title, //===title:title
        description,
        hashtags: Video.formatHashtags(hashtags),  //static 사용,

     });
        return res.status(400).redirect("/");
    }catch(error){
        return res.render("Upload", {pageTitle: "Upload Video",  errorMessage: error._message});
    }
}

export const watch = async(req, res) => {
    const {id} = req.params; // === const id = req.params.id;, get method로 query에 쓰인 id 저장
    const video = await Video.findById(id);
    if(!video){
        return res.status(404).render("404", {pageTitle: "Error: Video Not Found"})
    }
    return res.render("watch", {pageTitle: video.title, video});
}; 

export const getEdit = async(req, res) =>{
    const {id} = req.params;
    const video = await Video.findById(id);
    if(!video){
        return res.status(404).render("404", {pageTitle: "Error: Video Not Found"})
    }
    return res.render("edit",{pageTitle: `Editing: ${video.title}`, video, })
}

export const postEdit = async(req, res) =>{
    const {id} = req.params; //query로 부터 받아드리는 정보
    const {title, description, hashtags} = req.body; //template의 form의 name으로부터 받아드리는 정보
    const video = await Video.exists({_id:id});
    if(!video){
        return res.render("404", {pageTitle: "Error: Video Not Found"})
    }
    await Video.findByIdAndUpdate(id,{
        title,
        description,
        hashtags: Video.formatHashtags(hashtags), //static 사용
    })
    return res.redirect(`/videos/${id}`);
}

export const deleteVideo = async(req,res) =>{
    const {id} = req.params;
    await Video.findByIdAndDelete(id);
    return res.redirect("/")
}

export const search = async(req,res) =>{
    const { keyword } = req.query; //template에서 name=keyword가 url의 query로 들어가 변수로 받을 수 있게 됨.
    let videos = [];
    if(keyword){ //search input에 무엇인가 써서 search를 했다면.
        videos = await Video.find({
            title: { $regex: new RegExp(`${keyword}`,"i") } , //keyword가 포함된 title을 찾는 regexp 사용
        }).sort({createdAt:"desc"});
    }
    return res.render("search", {pageTitle: "Search", videos});
}
