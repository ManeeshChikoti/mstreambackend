const jwt =require("jsonwebtoken");

function verification(req,res, next){
const authHeader=req.headers.token;

if(authHeader){

    //getting the token from autHeader
const token=authHeader.split(" ")[1]
jwt.verify(token,process.env.SECRET_KEY,(error,user)=>{
    if(error)
    {
        res.status(403).json("Invalid token")
   }else{
       req.user=user;
       next();
   }
});
}else{
    return res.status(401).json("you are not authenticated");
}
}

module.exports=verification;