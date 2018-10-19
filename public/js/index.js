        var socket = io(); 
        socket.on('connect',function() {
            console.log('connected to server');

        });

        socket.on('disconnect',function(){
            console.log('disconnected from server');
        });

        socket.on('newMessage', function(data){
            //console.log("newMessage", data);

            var li = jQuery('<li></li>');
            li.text(`${data.from}: ${data.text}`);
            jQuery('#messages').append(li);
        });

        
        socket.on('newLocationMessage', function(data){
           var li = jQuery('<li></li>');
           var a = jQuery(`<a href='${data.url}' target='_blank'>Click here for location</a>`);

            li.text(`${data.from}: `);
            li.append(a);
            jQuery('#messages').append(li);
        });


        jQuery('#message-form').on('submit',function(e){
            e.preventDefault();

            var messageTextBox = jQuery('[name=message]');
            socket.emit('createMessage',{
                from:'User',
                text:messageTextBox.val()
            }, function(data){
                messageTextBox.val('');
            });
        });

        var locationButton = jQuery('#send-location')
        locationButton.on('click',function(){
            if(!navigator.geolocation){
                return alert('Geolocation not supported by your browser');
            }
            locationButton.attr('disabled','disabled').text('Sending location..');
            navigator.geolocation.getCurrentPosition(function(position){
                locationButton.removeAttr('disabled').text('Send location');
                   socket.emit('createLocationMessage',{
                       latitude:position.coords.latitude,
                       longitude:position.coords.longitude
                   })
            }, function(){
                locationButton.removeAttr('disabled').text('Send location');
                alert('Unable to fetch location');
            })
        });