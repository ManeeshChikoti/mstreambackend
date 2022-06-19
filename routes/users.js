const router=require("express").Router();
const User=require("../models/User");
const CryptoJS=require("crypto-js");
const verification=require("../tokenVerification")

//updating the info of an existing user
router.put("/:id",verification ,async(req,res)=>{
//admin and registered used can delete an user
    if(req.user.id===req.params.id || req.user.isAdmin){

  //if he want change his password then we have need to encrypt the password      
       if(req.body.password) {
           req.body.password=CryptoJS.AES.encrypt(req.body.password,process.env.SECRET_KEY).toString();
       }
       try{
          
        const updatedUser=await User.findByIdAndUpdate(req.params.id,{$set:req.body},{new:true});
        res.status(200).json(updatedUser);
       }catch(error){
           res.status(500).json(error);
       }
    }else{
        res.status(403).json("You can update only your account information")
    }
});

//for deleting a user 

router.delete("/:id",verification, async (req,res)=>{
    if(req.user.id === req.params.id ||req.user.isAdmin){
        try{
            await User.findByIdAndDelete(req.params.id);
            res.status(200).json("Account has been deleted");
        } catch(error){
             res.status(500).json("error");
        }
    }else{
        res.status(403).json("Only user can delete his account");
    }
});

//for getting an user

router.get("/find/:id", async (req,res)=>{

        try{
           const user= await User.findById(req.params.id);
           const {password, ...otherinfo}=user._doc;
            res.status(200).json(otherinfo);
        } catch(error){
             res.status(500).json(error);
        }
    
});


//for getting all users only admin can see all the users info
router.get("/",verification, async (req,res)=>{
    const query=req.query.new
    if(req.user.isAdmin){
        try{

            //using ternary operation to get the required information
         const users= query ? await User.find().sort({_id:-1}).limit(5):await User.find();
            res.status(200).json(users);
        } catch(error){
             res.status(500).json(error);
        }
    }else{
        res.status(403).json("Only admin has access to all the registerd users");
    }
});


// to get the total stats of an user in a specific time period
router.get("/stats", async (req,res)=>{
   const today=new Date();
   const lastyear=today.setFullYear(today.setFullYear()-1);
   //const monthsArray=[ January, February, March, April, May, June, July, August, September, October, November, December];
   try{

    //aggretatimg the user information based the month they are created and displaying newly created users in that month
      const data=await User.aggregate([
      { $project:{
              month:{$month:"$createdAt"}
          }
      },{
          $group:{
              _id:"$month",
              total:{$sum:1}
          }
      }
])

  res.status(200).json(data);
   }catch(error){
       res.status(500).json(error)
   }
})
module.exports=router;