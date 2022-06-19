const express=require("express");
const app=express();
const mongoose=require("mongoose");
const dotenv=require("dotenv");
const cors=require("cors");
const authRoute=require("./routes/auth");
const userRoute=require("./routes/users");
const movieRoute=require("./routes/movies");
const listRoute=require("./routes/lists");
dotenv.config();

const PORT=process.env.PORT||9999;

mongoose.connect(process.env.MONGO_URL)
.then(()=>console.log("connected to database"))
.catch((error)=>console.log(error));

app.use(cors())
app.use(express.json());
app.use("/api/auth", authRoute);
app.use("/api/users", userRoute);
app.use("/api/movies",movieRoute);
app.use("/api/lists",listRoute);


app.listen(PORT, ()=>{
    console.log("server is running")
})
