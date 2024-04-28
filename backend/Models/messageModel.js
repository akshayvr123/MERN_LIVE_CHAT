const mongoose=require("mongoose")

const messageModel=mongoose.Schema({
    sender:{ type:mongoose.Schema.Types.ObjectId,ref:"User"},
    content:{type:String,trim:true},
    chat:{ type:mongoose.Schema.Types.ObjectId,ref:"Chat"}
},{
    timestamps:true
})

const Message=mongoose.model("Message",messageModel)

module.exports=Message


// In Mongoose, mongoose.Schema.Types.ObjectId is a special type used to define a schema path for MongoDB
//  ObjectIds. MongoDB, which is a NoSQL database, generates unique identifiers for each document called ObjectIds.
//  These ObjectIds are typically used as the primary key for documents in MongoDB collections.