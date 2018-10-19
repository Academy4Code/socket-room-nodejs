        var socket = io(); 
        socket.on('connect',function() {
            console.log('connected to server');

        });

        socket.on('disconnect',function(){
            console.log('disconnected from server');
        });
        socket.emit('createEmail',{
            to:'rosy@exp.com',
            text :'Hey I have  created a email'
        });


        socket.on('newEmail', function(data){
            console.log("New Email", data);
        });