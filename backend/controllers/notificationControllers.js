const asyncHandler=require('express-async-handler')
const Notification=require('../Models/NotificationModel');



const addNotification = asyncHandler(async (req, res) => {
    
    const {notification} = req.body;

    if(!notification){
        // console.log('Invalid data passed');
        // return res.sendStatus(400);
        console.log("invalid data passed")
        return res.sendStatus(400)
    }

    const notificationExist=await Notification.find({user:req.user._id})
    console.log(notificationExist);

    if(notificationExist.length>0){
        const updatedData = await Notification.findOneAndUpdate(
            { user: req.user._id },
            { $push: { notification: notification } },
            { new: true } // to return the updated document
        );

        res.send(updatedData);
    }else{ 
  
    var newNotification = {
      user: req.user._id,
      notification: notification,
    };
    try {
        var message = await Notification.create(newNotification);
        res.send(message)
    } catch (error) {
        console.log(error);
    }
}
})

const getNotification=asyncHandler(async(req,res)=>{

    try {
        // const data=await Notification.find({user:req.user._id})
        // res.send(data[0].notification)
        const data=await Notification.find({user:req.user._id})
        res.send(data[0].notification)
        console.log("data sended successfully")
    } catch (error) {
        console.log(error);
    }

})

module.exports={addNotification,getNotification}