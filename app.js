// Setup basic express server
var fs = require('fs');
var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);
var mongo = require('mongodb').MongoClient;

var port = process.env.PORT || 3000;

server.listen(port, function () {
  console.log('Server listening at port %d', port);
});

app.use(express.static(__dirname + '/public'));

var numUsers = 0;

io.on('connection', function (socket) {
  var snapshot = new Date().getTime();
  socket.snapshot = snapshot;
  numUsers += 1;

  socket.emit('current', {
    numUsers: numUsers
  });

  socket.on('online', function (doc) {
    mongo.connect('mongodb://127.0.0.1/keylogger', function(err, db) {
      var col = db.collection('attempts');
      col.insert(doc, function() {});

      console.log('on_line::' + socket.snapshot);
    });
  });

  socket.on('input', function (attempt) {
    mongo.connect('mongodb://127.0.0.1/keylogger', function(err, db) {
      var col = db.collection('attempts');
      var query = {
        snapshot: attempt.snapshot,
        customerId: attempt.customerId
      };

      delete attempt.snapshot;
      delete attempt.customerId;

      col.update(query,
        { $push: { inputs: attempt } },
        function() {}
      );
    });
  });


  // when the user disconnects.. perform this
  socket.on('disconnect', function () {
    numUsers -= 1;

    console.log('offline::' + socket.snapshot);
  });
});
