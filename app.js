var app = require('express')(),
    server = require('http').createServer(app),
    io = require('socket.io').listen(server),
    ent = require('ent'), // Blocks HTML characters (security equivalent to htmlentities in PHP)
    fs = require('fs');


// Loading the page index.html
app.get('/', function (req, res) {
  res.sendfile(__dirname + '/index.html');
});

// app.use(express.static(__dirname + '/css'));

io.sockets.on('connection', function (socket, username) {
    // When the username is received it’s stored as a session variable and informs the other people
    socket.on('new_client', function(username) {
        username = ent.encode(username);
        socket.username = username;
        socket.broadcast.emit('new_client', username);
    });

    // When a message is received, the client’s username is retrieved and sent to the other people
    socket.on('message', function (message) {
        message = ent.encode(message);
        socket.broadcast.emit('message', {username: socket.username, message: message});
    }); 

    //  // When a  client leaves, the information is displayed
    //  socket.on('disconnect', function(username) {
    //     socket.username = username;
    //     socket.broadcast.emit('user_leave', username);
    // });


});

server.listen(8080);


//inspired from: https://openclassrooms.com/en/courses/2504541-ultra-fast-applications-using-node-js/2505787-practical-exercise-the-super-chat
// to run this go to browser and type->  localhost:8080
// on a new tab type the same thing and chat as 2 different user