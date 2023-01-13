//TODO :
// define web socket
// creat array for all users
// choose events for web socket: login, R W
require('dotenv').config()
const express = require('express');

const app = express();

app.use(express.static('./build'));
// import & create http server
const httpServer = require('http').createServer(app);
// import socket-io js files
const socket = require('socket.io');

const mongoose = require('mongoose');
const CodeModel = require('./codeModel');

// create socket server
const socketServer = socket(httpServer,{cors: {origin: "*"}});

const clientSocketArr = [];
const codeData = {
    subject:""
}


function write(messageBody){
    //TODO send teacher the code
    //console.log("send to client " + messageBody);
    for( let i = 0; i < clientSocketArr.length; i++){
        clientSocketArr[i].emit("clientwritecode", messageBody)
    }
    CodeModel.findOne({subject:codeData.subject})
        .then( codeDocument => {
            if(!codeDocument){
                const code = new CodeModel({subject: codeData.subject, code:messageBody});
                code.save()
                    .then(saveResp => {
                        console.log("created ", codeData.subject, saveResp);
                    })
            }else{
                codeDocument.code = messageBody;
                codeDocument.save()
                    .then(saveResp => {
                        console.log("created ", codeData.subject, saveResp);
                    })
            }
        })

}
    
// will run every time that someone login
// 
function handleClientSocket(clientSocket){
   
    
    clientSocket.on("login", function(message){
        codeData.subject = message;
        console.log("added socket", clientSocket.id);
        clientSocketArr.push(clientSocket)
        if(clientSocketArr.length == 1){
            clientSocketArr[0].emit("clientMode", "readonly");
        }else{
            clientSocketArr[clientSocketArr.length-1].emit("clientMode", "readwrite");
        }
    });
    // if client sends message with the name "writecode" -> call to func write with message body
    clientSocket.on("writecode", write);

}
socketServer.on("connection", handleClientSocket);

db_password = "1qu2xSk3JIg0ikci"
db_user = "limihodory"
const dbUrl = `mongodb+srv://${db_user}:${db_password}@cluster0.4idia0u.mongodb.net/codedb?retryWrites=true&w=majority`;
mongoose.connect(dbUrl)
    .then(() => {
        httpServer.listen(process.env.PORT ||5000);
        console.log("connected to db and listening on port 5000");
    }).catch(error => {
        console.log(error);
    })
