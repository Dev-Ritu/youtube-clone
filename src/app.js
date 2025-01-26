import cors from "cors";
import cookieParser from  "cookie-parser";
import { urlencoded } from "express";
import express from "express"

const app = express();
//cors is middle so any middleware is used with the use method or any config based changes
app.use(cors())
app.use(express.json({limit:"16kb"}))
app.use(urlencoded({extended:true, limit:"16kb"}))
app.use(express.static("public"))
app.use(cookieParser());


//routes import

import userRouter from "./routes/user.routes.js"

//routes declaration
app.use("/users/v1",userRouter)

export {app};