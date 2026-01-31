const express = require("express");
const Message = require("../models/Message");
const router = express.Router();

// get all messages 

router.get("/:room",async(req,res)=>{
    try{ 
        const{room = "general"} = req.query;
        const messages = await Message.find({room})
        .sort({timestamp:1})
        .limit(50);
        res.json(messages);
    }catch (error){
        res.status(500).json({error:"Server error"});
    }
});

// create new message

router.post("/", async(req,res)=>{
    try{
        const {sender,text,room} = req.body;
        if(!sender || !text){
            return res.status(400).json({error:"sender and text are required"});
        }
        const message = new Message({
            sender,text,
            room:room || "general"
        });
        await message.save();
        res.status(201).json(message);

    }catch (error){
        res.status(500).json({error:"server error"});
    }
});

// delete message

router.delete("/:id",async(req,res)=>{
    try{
        const message = await Message.findByIdAndDelete(req.params.id);
        if(!message){
            return res.status(404).json({error:"Message not found"});

        }
        res.json({message:"Message deleted successfully"});

    }catch (error){
        res.status(500).json({error:"Server error"});
    }
});

module.exports = express.router;