export const recommended = (req, res) =>{
    const videos = [
        {
            title: "Video #1",
            views: 56,
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
            id: 1,
        },
        {
            title: "Video #3",
            views: 56,
            comments: 221,
            createdAt: "40 minutes ago",
            rate: 4,
            id: 1,
        }
    ]
    res.render("home", {pageTitle: "Home", videos});
} 
export const search = (req, res) => res.send("Search a Video");

export const upload = (req, res) => res.send("Upload a Videos");
export const see = (req, res) => res.render("watch", {pageTitle: "Watch"});
export const edit = (req, res) => res.render("edit", {pageTitle: "Edit"});
export const deleteVideo = (req,res) => {
    return res.send(`Delete video #${req.params.id}`)
};
