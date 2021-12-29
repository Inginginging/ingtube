import "regenerator-runtime";
import "dotenv/config";
import "./db"; 
import "./models/Video";
import "./models/User";
import "./models/Comment";
import app from "./server";

const PORT = process.env.PORT || 4000;

const handleListening = () =>console.log(`✅ Server listening on port http://localhost:${PORT} 🚀`);

app.listen(PORT,handleListening);


//주석 지우기전에 깃헙 올리고 주석 지우고 깃헙 올리기 두번!!!!!!!!!!