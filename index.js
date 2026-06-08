const express = require('express');
const app = express();
const path = require('path');
const methodOverride = require('method-override');
const port = 8080;
const mongoose = require('mongoose');
const Chat = require('./models/chat');

app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname,"public")))
app.use(express.json())
app.use(express.urlencoded({extended:true}))

async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/whatsapp')
};

main().then((res)=>{
    console.log('Connection Successful')
}).catch((err)=>{
    console.log('Some error Occured!!')
})


//Get route
app.get("/chats",async(req,res)=>{
    let chats = await Chat.find();
    res.render("show",{chats});
})

//Render new page
app.get("/chats/new",(req,res)=>{
    res.render("new");
})

//Adding new page
app.post("/chats",(req,res)=>{
   let {from,to,message} = req.body;
   const newchat = new Chat({
      from: from,
      to: to,
      message: message
   })
   newchat.save().then((results)=>{
    res.redirect("/chats")
   })
})

//Rendering edit page
app.get("/chats/:id/edit",async(req,res)=>{
    let {id} = req.params;
    let chat = await Chat.findById(id);
    res.render("edit",{chat});
})

//Update route
app.put("/chats/:id",async(req,res)=>{
    let {id} = req.params;
    let {message} = req.body;
    let updatedchat = await Chat.findByIdAndUpdate(id,{message}, {runvalidators: true,new:true});
    console.log(updatedchat);
    res.redirect("/chats");
})

//Delete Route
app.delete("/chats/:id",async(req,res)=>{
    let {id} = req.params;
    let chattodelete = await Chat.findByIdAndDelete(id);
    res.redirect("/chats");
})


app.listen(port, ()=>{
    console.log("Server is listening to port!!")
})



