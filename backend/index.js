const express=require("express")
const { chats } = require("./data/data")
const dotenv=require('dotenv')
const connectDB=require('./config/db')
const colors=require('colors')
const userRoutes=require('./routes/userRoutes')
const chatRoutes=require('./routes/chatRoutes')
const messageRoutes=require('./routes/messageRoutes')
const notificationRoutes=require('./routes/notificationRoutes')
const { notFound, errorHandler } = require("./middlewares/errorMiddleware")
const cors=require('cors')



dotenv.config()
connectDB()

const app=express()
// CORS Configuration
const corsOptions = {
    origin: "https://live-chat-frontend-hazel.vercel.app", // Replace with your frontend URL
    methods: ["GET", "POST", "PUT", "DELETE"], // Allowed HTTP methods
    credentials: true, // Allow cookies or auth headers
  };
  app.use(cors(corsOptions));
// app.use(cors({
//     origin: "https://live-chat-frontend-tev1jv35w-akshay-vrs-projects.vercel.app", // Replace with your frontend URL
//     methods: ["GET", "POST", "PUT", "DELETE"], // Allowed HTTP methods
//     credentials: true, // Allow cookies
// }));
app.options('*', cors(corsOptions));

app.use(express.json()) //to accept json data
app.get('/',(req,res)=>{
    res.send("API is running")
}) 
app.use('/api/user',userRoutes)
app.use('/api/chat',chatRoutes)
app.use('/api/messages',messageRoutes)
app.use('/api/notification',notificationRoutes)
// app.use(notFound)
app.use(errorHandler)

const PORT=process.env.PORT || 5000


const server=app.listen(PORT,console.log(`Server started in port ${PORT}`.yellow.bold))

const io=require('socket.io')(server,{
    pingTimeout:60000,
    cors: {
        origin: "https://live-chat-frontend-hazel.vercel.app",
        methods: ["GET", "POST"],
        credentials: true,
    },
})
io.on("connection",(socket)=>{
    console.log("Connected to socket.io");

    socket.on('setup',(userData)=>{
        console.log(userData._id);
      socket.join(userData._id)
      socket.emit('connected')
    })
    socket.on('join chat',(room)=>{
        socket.join(room)
        console.log('User joined Room'+room);
    })

    socket.on('typing',(room)=>socket.in(room).emit('typing'))
    socket.on('stop typing',(room)=>socket.in(room).emit('stop typing'))

    socket.on('new message',(newMessageRecieved)=>{
        var chat=newMessageRecieved.chat

        if(!chat.users) return console.log("chat.users not defined");;
        chat.users.forEach(user=>{
            if(user._id===newMessageRecieved.sender._id) return
            socket.in(user._id).emit('message recieved',newMessageRecieved)
        })
    })

    socket.off('setup',()=>{
        console.log("user disconnected");
        socket.leave(userData._id)
    })
})