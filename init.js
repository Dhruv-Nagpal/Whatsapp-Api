const mongoose = require('mongoose');
const Chat = require('./models/chat');

async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/whatsapp')
}

main().then((res) => {
    console.log('Connection Successful')
}).catch((err) => {
    console.log('Some error Occurred!!')
})

Chat.insertMany([
    {
        "from": "Dhruv",
        "to": "Rahul",
        "message": "Bhai kal milte hain?"
    },

    {
        "from": "Rahul",
        "to": "Dhruv",
        "message": "Haan bhai 5 baje free hoon"
    },

    {
        "from": "Aman",
        "to": "Neha",
        "message": "Assignment complete hua?"
    },
    {
        "from": "Neha",
        "to": "Aman",
        "message": "Nahi yaar abhi kar rahi hoon 😅"
    },
    {
        "from": "Riya",
        "to": "Simran",
        "message": "Party kab rakhni hai?"
    },
    {
        "from": "Simran",
        "to": "Riya",
        "message": "Weekend pe plan karte hain 🎉"
    }


])