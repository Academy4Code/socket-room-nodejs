const  path  = require('path');
const  http  = require('http');
const {generateMessage,generateLocationMessage} = require('./utils/message')
const  express  = require('express');
const  socketIO  = require('socket.io');

const publicPath = path.join(__dirname,'../public');
const port = process.env.PORT || 3000;
var app  = express();
var server = http.createServer(app);
var io  = socketIO(server);

app.use(express.static(publicPath));
io.on('connection', (socket)=>{
    console.log('New user Connected');

    //socket.emit from Admin --> Welcome to chat app
    socket.emit('newMessage',generateMessage('Admin','Welcome to app chat'));

    //socket.broadcast.emit from admin - New User joined
    socket.broadcast.emit('newMessage',generateMessage('Admin','New User Joined'));

    socket.on('createMessage',(message, callback)=>{
        console.log('createMessage'+ JSON.stringify(message));
        io.emit('newMessage',generateMessage(message.from,message.text));
        callback('This is from the server side');
       
    }); 

    socket.on('createLocationMessage',(cords)=>{
        io.emit('newLocationMessage',generateLocationMessage('Admin',cords.latitude, cords.longitude));
        
    });
    socket.on('disconnect',()=>{
        console.log('disconnected to server');
        
    });

});

server.listen(port,()=>{
    console.log(`Server is up on ${port}`);;
    
})
