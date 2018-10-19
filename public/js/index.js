        var socket = io(); 
        socket.on('connect',function() {
            console.log('connected to server');

        });

        socket.on('disconnect',function(){
            console.log('disconnected from server');
        });

        socket.on('newMessage', function(data){
            var formattedTime = moment(data.createdAt).format('h:mm a');
            var template = jQuery('#message-templete').html();

            var html = Mustache.render(template,{
                text:data.text,
                time:formattedTime,
                from:data.from
            });
            jQuery('#messages').append(html);

            // var formattedTime = moment(data.createdAt).format('h:mm a');
            // //console.log("newMessage", data);

            // var li = jQuery('<li></li>');
            // li.text(`${data.from} ${formattedTime} : ${data.text}`);
            // jQuery('#messages').append(li);
        });

        
        socket.on('newLocationMessage', function(data){
            var formattedTime = moment(data.createdAt).format('h:mm a');

            var template = jQuery('#location-message-templete').html();

            var html = Mustache.render(template,{
                url:data.url,
                time:formattedTime,
                from:data.from
            });
            jQuery('#messages').append(html);

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