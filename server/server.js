const  path  = require('path');
const  http  = require('http');
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

    socket.on('createMessage',(newEmail)=>{
        console.log('createMessage'+ JSON.stringify(newEmail));

        io.emit('newMessage',{
            from:newEmail.from,
            text :newEmail.text,
            createdAt:new Date().getTime()
        });
    
        
    }); 

    socket.on('disconnect',()=>{
        console.log('disconnected to server');
        
    });

});

server.listen(port,()=>{
    console.log(`Server is up on ${port}`);;
    
})
