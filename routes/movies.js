const router=require("express").Router();
const Movie=require("../models/Movie");
const verification=require("../tokenVerification")

//creating a new movie 
router.post("/",verification ,async(req,res)=>{

    if(req.user.isAdmin){

        const newMovie= new Movie(req.body);
        try{
           const savedMovie=await newMovie.save();
           res.status(201).json(savedMovie);
        }catch(error){
            res.status(500).json(error);
        }
  
    }else{
        res.status(403).json("Only admin can access")
    }
});

//updating a movie 
router.put("/:id",verification ,async(req,res)=>{

        if(req.user.isAdmin){
    
        
            try{
               const updatedMovie=await Movie.findByIdAndUpdate(req.params.id, {$set:req.body},{new:true});
               res.status(200).json(updatedMovie);
            }catch(error){
                res.status(500).json(error);
            }
      
        }else{
            res.status(403).json("Only admin can access")
        }
    });

//for deleting a user
    router.delete("/:id",verification ,async(req,res)=>{

        if(req.user.isAdmin){

            try{
               await Movie.findByIdAndDelete(req.params.id);
               res.status(200).json("Movie has been  deleted");
            }catch(error){
                res.status(500).json(error);
            }
      
        }else{
            res.status(403).json("Only admin can access")
        }
    });

//for getting a movie
    router.get("/find/:id",verification ,async(req,res)=>{

            try{
             const  movie= await Movie.findById(req.params.id);
               res.status(200).json(movie);
            }catch(error){
                res.status(500).json(error);
            }
      
       
    });

//for getting a random movie

    router.get("/randomOne",verification ,async(req,res)=>{
    const type=req.query.type;
    let movie;
        try{
         if(type==="series"){
                movie=await Movie.aggregate([
                    { $match:{ isSeries:true} },
                    { $sample:{size:1}  }
                ]);
           }else{
             movie=await Movie.aggregate([
                 { $match:{ isSeries:false} },
                 { $sample:{size:1}  }
            ]);
           }
           res.status(200).json(movie);
        }catch(error){
            res.status(500).json(error);
        }
  
   
});


//for getting all movies

router.get("/",verification ,async(req,res)=>{

    if(req.user.isAdmin){

        try{
          const movies= await Movie.find();
           res.status(200).json(movies);
        }catch(error){
            res.status(500).json(error);
        }
  
    }else{
        res.status(403).json("Only admin can access")
    }
});

module.exports=router;