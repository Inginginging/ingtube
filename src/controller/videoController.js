let videos = [
    {
        title: "Video #1",
        views: 1,
        comments: 221,
        createdAt: "40 minutes ago",
        rate: 4,
        id: 1,
    },
    {
        title: "Video #2",
        views: 56,
        comments: 221,
        createdAt: "40 minutes ago",
        rate: 4,
        id: 2,
    },
    {
        title: "Video #3",
        views: 56,
        comments: 221,
        createdAt: "40 minutes ago",
        rate: 4,
        id: 3,
    }
]

export const recommended = (req, res) =>{ 
    res.render("home", {pageTitle: "Home", videos});
}
export const watch = (req, res) => {
    const {id} = req.params; // === const id = req.params.id;
    const video = videos[id-1]; //video 배열에서 선택된 id에 해당된 하나의 요소 저장하는 변수.
    return res.render("watch", {pageTitle: `Watching: ${video.title}`, video});
}; 
export const getEdit = (req, res) =>{
    const {id} = req.params;
    const video = videos[id-1];
    return res.render("edit",{pageTitle: `Editing: ${video.title}`, video})
}
export const postEdit = (req, res) =>{
    const {id} = req.params;
    const {title} = req.body;
    videos[id-1].title = title;
    return res.redirect(`/videos/${id}`);
}
export const getUpload = (req,res) =>{
    return res.render("Upload", {pageTitle: "Upload Video"})
}
export const postUpload = (req,res) =>{
    const {title} = req.body;
    const newVideo = {
        title,
        views: 0,
        comments: 0,
        createdAt: "just now",
        rate: 0,
        id: videos.length+1,
    }
    videos.push(newVideo);
    return res.redirect("/");
}