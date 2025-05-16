import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"
import connectDB from "./utils/db.js";
import userRoute from "./routes/user.route.js"

const app = express();

 const PORT = process.env.PORT || 3000;


app.get("/", (_, res)=> {
    return res.status(200).json({
        message:"I am coming from backend",
        success:true
    })
})


//middlewares
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({extended:true}));

const corsOptions = {
    origin:'http://localhost:5173',
    credentials:true
}
 app.use(cors(corsOptions))

app.use("/api/v1/user", userRoute)


 app.listen(PORT, ()=>{
    connectDB();
    console.log(`Server Listen at ${PORT}`)
 })