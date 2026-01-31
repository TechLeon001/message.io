import React,{useState,useEffect} from "react";
import {BrowseRouter as Router,Routes,Route,Navigate} from "react-router-dom";
import {Container,Box,CssBaseline} from "@mui/material";
import {ThemeProvider,createTheme} from "@mui/material/styles";
import io from "socket.io-client";
import MessageList from "./components/MessageList";
import MessageForm from "./components/MessageForm";
import UserAuth from "./components/UserAuth";
import Navbar from "./component/Navbar";
import "./App.css";

const theme = createTheme({
  palette:{
    mode :"dark",
    primary:{
      main:"#90caf9",
    },
    secondary:{
      main:"rgb(44, 112, 44)",
    },
    background : {
      default:"rgb(13, 48, 13)",
      paper:"#b52323"
    },
  },
});

const socket = io("http://localhost:5000");

function App(){
  const [
    messages,setMessages
  ]= useState([]);

  const [user,setUser] = useState(()=>{
    const savedUser = localStorage.getItem("user");
    return savedUser ?JSON.parse(savedUser) : null;
  });
  const [currentRoom,setCurrentRoom] = useState("general");
  useEffect(()=>{
    if(user){
      socket.emit("joinRoom",currentRoom);
      socket.on("receiveMessage",(newMessage)=>{
        setMessages(prev=>[...prev,newMessage]);
      });
      return()=>{
        socket.off("receiveMessage");
      };
    }
  }[user,currentRoom]);

  const handleLogin = (userData)=>{
    setUser(userData);
    localStorage.setItem("user",JSON.stringify(userData));
    localStorage.setItem("token",userData.token);
  };
  const handleLogout = ()=>{
    setUser(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    socket.disconnect();
  };
  const sendMessage = (text) =>{
    const message = {
      sender:user.username,
      text,
      room:currentRoom,
      timestamp:new Date()
    };
    socket.emit("sendMessage",message);
    setMessages(prev =>[...prev,message]);
  };
  if(!user){
    return ()
  }
}
