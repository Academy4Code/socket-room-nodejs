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
 
    socket.emit('newEmail',{
        from:'ravindra@exp.com',
        text :'Hey',
        createdAt:123
    });

    socket.on('createEmail',(newEmail)=>{
        console.log('create Email'+ JSON.stringify(newEmail));
        
    });

    socket.on('disconnect',()=>{
        console.log('disconnected to server');
        
    });

});

server.listen(port,()=>{
    console.log(`Server is up on ${port}`);;
    
})
