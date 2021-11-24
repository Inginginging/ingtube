//내가 만드는 여러가지 middleware file

export const localsMiddleware =(req, res, next) =>{
    res.locals.loggedIn = Boolean(req.session.loggedIn); //login 했으면 req.session.loggedIn의 값은 true
    res.locals.loggedInUser = req.session.user;
    res.locals.siteName = "Ingtube";
    next();
}