const asyncHandler=require('express-async-handler')
const User=require('../Models/userModel')
const generateToken=require("../config/generateToken")

//User Registeration
const registerUser=asyncHandler(async(req,res)=>{
    const {name,email,password,pic}=req.body
    if(!name || !email || !password){
        res.status(400)
        throw new Error("Please enter all fields")
    }

    const userExists=await User.findOne({email})
    if(userExists){
        throw new Error("User already exists")
    }
    const user=await User.create({
        name,
        email,
        password,
        pic
    })
     if(user){
      res.status(201).json({
        _id:user._id,
        name:user.name,
        email:user.email,
        pic:user.pic,
        token:generateToken(user._id)
      })
     }else{
        res.status(400)
        throw new Error("Failed to create user")
     }
}) 
//Login
const authUser=asyncHandler(async(req,res)=>{
    const {email,password}=req.body
    if(!email || !password){ 
        res.status(400).send("Send all required fields")

    }
    const user=await User.findOne({email})
    if(user && (await user.matchPassword(password))){
      res.json({
        _id:user._id,
        name:user.name,
        email:user.email,
        pic:user.pic,
        token:generateToken(user._id)
      })  
    }else{
        res.status(401);
        throw new Error("Invalid Email or Password")
    }
}
) 
const allUsers=asyncHandler(async(req,res)=>{
   const keyword=req.query.search ?{
    $or:[
        //Regex in mongoDb
        {name:{$regex:req.query.search,$options:'i'}},
        {email:{$regex:req.query.search,$options:'i'}},
    ]
   }:{}
   //$ne stands for not equal to
   const users=await User.find(keyword).find({_id:{$ne:req.user._id}})
   res.send(users)
})

module.exports={registerUser,authUser,allUsers}
