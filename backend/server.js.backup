const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const http = require("http");
const socketIo = require("socket.io");
const PORT = process.env.PORT || 5000;

require("dotenv").config();

const messageRoutes = require("./routes/messages");
const authRoutes = require("./routes/auth");

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

// middleware

app.use(cors());
app.use(express.json());

//routes 
app.use("/api/messages", messageRoutes);
app.use("/api/auth", authRoutes);

//database connection
mongoose.connect(process.env.MONGODB_URI)
     .then(()=>console.log("connected to the database"))
        .catch((err)=>console.log("database connection error:", err));


//socket.io real-time communication
io.on("connection",(socket)=>{
    console.log("New client connect",socket.id)

socket.on("joinRoom",(room)=>{
    socket.join(room);
    console.log("user joined room:${room}");
});

socket.on("sendMessage",(data)=>{
    io.to(data.room).emit("receiveMessage",data);

});

socket.on("disconnect",()=>{
    console.log("client disconnect",socket.id);
});
});

server.listen(PORT,()=>{
    console.log(`server running on port ${PORT}`);
});