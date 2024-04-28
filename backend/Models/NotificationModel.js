const mongoose=require("mongoose")

const notificationModel=mongoose.Schema({
    user:{ type:String},
    notification:{type:Array}
   
},{
    timestamps:true
})

const Notification=mongoose.model("Notification",notificationModel)

module.exports=Notification