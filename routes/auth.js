const router=require("express").Router();
const User=require("../models/User");
const CryptoJS = require("crypto-js");
const jwt =require("jsonwebtoken");
//route for registering a user
router.post("/register", async(req,res)=>{

  
    
    try{
const userExists=await User.findOne({email:req.body.email})
  if(userExists){
                res.status(401).json("user already exists")
             }
   else{
       const newUser= new User({
        username:req.body.username,
        email:req.body.email,
        password: CryptoJS.AES.encrypt(req.body.password,process.env.SECRET_KEY).toString(),
        isAdmin:req.body.isAdmin
    });
     const user= await newUser.save();
     res.status(200).json(user);
}
    }catch(error)
    {
        res.status(501).json(error);
    }
});

//route for login 
router.post("/login",async(req,res)=>{
    try{
     const user= await User.findOne({email:req.body.email});
     //if credentials are wrong 
     if(!user){ 
         res.status(401).json("invalid username or password");
        }
else{
//if there is usesr and password doesnot match
     const  bytes  = CryptoJS.AES.decrypt(user.password,process.env.SECRET_KEY);
     const  decryptedPassword = bytes.toString(CryptoJS.enc.Utf8);

    if( decryptedPassword !== req.body.password){
        res.status(401).json("Wrong Password");
    }
    else{
//sending a token
const token =await jwt.sign(
    {
        id: user._id,
        isAdmin: user.isAdmin
    },
    process.env.SECRET_KEY,
    { expiresIn: "10d" }
);
//if password match destructuring the user and sendig required information
const {password, ...otherinfo}=user._doc;
res.status(200).json({...otherinfo,token});
}}
    }catch(error){
        res.status(501).json(error)
    }
    
})




module.exports=router;
