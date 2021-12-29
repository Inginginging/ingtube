//내가 만드는 여러가지 middleware file
import multer from "multer";
import multerS3 from "multer-s3";
import aws from "aws-sdk";

const s3 = new aws.S3({
    credentials: {
        accessKeyId: process.env.AWS_ID,
        secretAccessKey: process.env.AWS_SECRET,
    }
})

const multerUploader = multerS3({
    s3:s3,
    bucket: "ingtube",
    //acl: "public-read",
})

export const localsMiddleware =(req, res, next) =>{
    res.locals.loggedIn = Boolean(req.session.loggedIn); //login 했으면 req.session.loggedIn의 값은 true
    res.locals.loggedInUser = req.session.user || {};
    res.locals.siteName = "Ingtube";
    next();
}

export const protectorMiddleware = (req,res,next) =>{ //logout된 사용자가 특정 url에 들어가는 것을 막는 middleware
    if(req.session.loggedIn){
        return next(); //login 돼있으면 다음 요청을 수행해도 됨.
    }else{
        req.flash("error", "Login First"); //flash message 띄우기
        return res.redirect("/login") //login 돼있지 않으면 login 페이지로 redirect함.
    }
}

export const publicOnlyMuddleware = (req,res,next) =>{ //login된 사용자가 특정 url에 들어가는 것을 막는 middleware 
    if(!req.session.loggedIn){
        return next(); //logout 돼있으면 다음 요청 수행해도 됨.
    }else{
        req.flash("error", "Already Authorized"); //flash message 띄우기
        return res.redirect("/") //logout돼 있지 않으면 home으로 redirect
    }
}

export const avatarUpload = multer({
    dest:"uploads/avatars/",  //upload file들의 destination은 upload/avatars 폴더
    limits:{
        fileSize: 3000000,//3mb 이상은 업로드 못함
    },
    storage: multerUploader,
})
 
export const videoUpload = multer({
    dest: "uploads/videos/",
    limits:{
        fileSize: 100000000,//100mb
    },
    storage: multerUploader,
})