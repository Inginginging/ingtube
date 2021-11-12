export const recommended = (req, res) => res.send("Home Videos");
export const search = (req, res) => res.send("Search a Video");

export const upload = (req, res) => res.send("Upload a Videos");
export const see = (req, res) => {
    return res.send(`Watch video #${req.params.id}`)
};
export const edit = (req, res) => {
    return res.send(`Edit video #${req.params.id}`)
};
export const deleteVideo = (req,res) => {
    return res.send(`Delete video #${req.params.id}`)
};
