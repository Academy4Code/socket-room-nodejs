        var socket = io(); 

        function scrollToBottom(){
            //Selectors
            var messages = jQuery('#messages');
            var newMessage = messages.children('li.last-child');           
            // Heights
            var clinetHeight = messages.prop('clientHeight');
            var scrollTop = messages.prop('scrollTop');
            var scrollHeight = messages.prop('scrollHeight');
            var newMessageHeight  = newMessage.innerHeight();
            var lastMessageHeight  = newMessage.prev().innerHeight();
            
            if(clinetHeight+scrollTop>= scrollHeight){
                console.log("Should scroll");
                
                messages.scrollTop(scrollHeight);
            }
        }

        socket.on('connect',function() {
           var params = jQuery.deparam(window.location.search);

           socket.emit('join',params,function(err){
            if(err){
                alert(err);
                window.location.href = '/';
            }else{
                console.log('No Error');
            }
           })
        });
        


        socket.on('disconnect',function(){
            console.log('disconnected from server');
        });

        socket.on('updateUserList', function(users){
            //console.log('users list1', users);
            var ol = jQuery('<ol></ol>');
            users.forEach(function(user){
                ol.append(jQuery('<li></li>').text(user));
            });
            jQuery('#users').html(ol);
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
            scrollToBottom();

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
            scrollToBottom();
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