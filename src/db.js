import mongoose from "mongoose";

mongoose.connect(process.env.DB_URL);

const db = mongoose.connection;

const handleError = (error) =>console.log("❌ DB Error: ", error);
const handleOpen = () =>console.log("✅ Connected to DB");


db.on("error", handleError); //error event는 수시로 일어날 수 있음.
db.once("open", handleOpen); //open event는 한번만 일어남. ->once 사용