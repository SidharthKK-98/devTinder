const socket=require("socket.io")
const Chat = require("../models/chat")

const initializeSocket=(server)=>{

    let onlineUsers= new Map()


    const io=socket(server,{
        cors:{
            origin:["http://localhost:5173","https://dev-tinder-frontend-gray.vercel.app"]
        }
    })


    
    io.on("connection",(socket)=>{


        socket.on("usersConnected",({userId})=>{

            onlineUsers.set(userId,socket.id)
            console.log(onlineUsers);
            
            io.emit("onlineUsers",[...onlineUsers.keys()])

        })

        socket.on("joinChat",({userId,targetUserId})=>{

            const roomId=[userId,targetUserId].sort().join("_")
            console.log(roomId);
            socket.join(roomId)
            

        })

        socket.on("sendMessage",async({firstName,lastName,userId,targetUserId,text})=>{


            try{

                const roomId=[userId,targetUserId].sort().join("_")


                let chat = await Chat.findOne({
                    participants:{$all:[userId,targetUserId]}
                })
                if(!chat){
                    chat=new Chat({
                        participants:[userId,targetUserId],
                        messages:[]
                    })
                }

                chat.messages.push({
                    senderId:userId,
                    text
                })

                await chat.save()

            io.to(roomId).emit("messageReceived",{firstName,lastName,text})


            }
            catch(err){
                console.log(err);
                
            }

        })

        socket.on("disconnect",()=>{

            for(let [userId,socketId] of onlineUsers.entries()){
                if(socketId==socket.id){
                    onlineUsers.delete(userId)
                    break
                }
            }

            io.emit("onlineUsers",[...onlineUsers.keys()])
            console.log("userDisconnected : ",socket.id);
            console.log(onlineUsers);

            

        })
    
    })

}

module.exports=initializeSocket