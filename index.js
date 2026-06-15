const express = require('express');
const app = express();
const path = require('path');
const methodOverride = require('method-override');
const port = 8080;
const mongoose = require('mongoose');
const Chat = require('./models/chat');
const ExpressError = require("./expresserror");

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

function asyncwrap(fn){
    return function(req,res,next){
        fn(req,res,next).catch((err)=>{
            next(err);
        })
    }
}


//Get route
app.get("/chats",asyncwrap(async(req,res)=>{
    let chats = await Chat.find();
    res.render("show",{chats});
}))

//Render new page
app.get("/chats/new",(req,res)=>{
    res.render("new");
})

//Adding new page
app.post("/chats",async(req,res,next)=>{
    try{
   let {from,to,message} = req.body;
   const newchat = new Chat({
      from: from,
      to: to,
      message: message
   })
  await newchat.save();  
  res.redirect("/chats");
   }catch(err){
    next(err);
   }
})

//Rendering edit page
app.get("/chats/:id/edit",asyncwrap(async(req,res,next)=>{
    let {id} = req.params;
    let chat = await Chat.findById(id);
    if(!chat){
     next(new ExpressError(500,"Chat not found"))
    }
    res.render("edit",{chat});
}));

//Update route
app.put("/chats/:id",asyncwrap(async(req,res)=>{
    let {id} = req.params;
    let {message} = req.body;
    let updatedchat = await Chat.findByIdAndUpdate(id,{message}, {runvalidators: true,new:true});
    console.log(updatedchat);
    res.redirect("/chats");
}))

//Delete Route
app.delete("/chats/:id",asyncwrap(async(req,res)=>{
    let {id} = req.params;
    let chattodelete = await Chat.findByIdAndDelete(id);
    res.redirect("/chats");
}))

const handlevalidationerr = ((err)=>{
  console.log("This was a validation error! Please follow rules :)")
  console.dir(err.message);
  return err;
})

app.use((err,req,res,next)=>{
    console.log(err.name);
    if(err.name === "ValidationError"){
        err = handlevalidationerr(err);
    }
    next(err);
})

app.use((err,req,res,next)=>{
    let {status = 500, message = "Some error occured"} = err;
    res.status(status).send(message);
})


app.listen(port, ()=>{
    console.log("Server is listening to port!!")
})



