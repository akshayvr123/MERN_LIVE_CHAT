const express=require('express')
const { protect } = require('../middlewares/authMiddleware')
const router=express.Router()
const {addNotification,getNotification}=require('../controllers/notificationControllers')

router.route('/').post(protect,addNotification)
router.route('/').get(protect,getNotification)

module.exports=router