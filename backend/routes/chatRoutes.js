const express=require("express")
const {protect}=require('../middlewares/authMiddleware')
const { accessChat,addToGroup,fetchChats,createGroupChat,renameGroup,removeFromgroup} = require("../controllers/chatControllers")


const router=express.Router()

router.route('/')
  .post(protect, accessChat)
  .get(protect, fetchChats);
   router.route('/group').post(protect,createGroupChat)
   router.route('/rename').put(protect,renameGroup)
   router.route('/groupadd').put(protect,addToGroup)
   router.route('/groupremove').put(protect,removeFromgroup)

module.exports=router