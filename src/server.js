import express from "express"; //node_modules에서 express import
import morgan from "morgan"; // morgan: external middleware

const PORT = 4000;
const app = express(); //express를 사용해 app객체를 만듬. (express의 기능을 가진 app) 
const logger = morgan("dev");

const handleHome = (req,res)=>{
    return res.send("Here is Home.");
}
const handleLogin=  (req, res)=>{
    return res.send("Login Here.")
}

app.use(logger);//morgan middleware를 global하게 사용
app.get("/", handleHome);
app.get("/login",handleLogin);


const handleListening = () =>console.log(`Server listening on port http://localhost:${PORT} 🚀`);

app.listen(PORT,handleListening);
