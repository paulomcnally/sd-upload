var querystring = require('querystring');
var http = require('https');

var url = 'https://api.imgur.com/3/image';

var Imgur = function() {

};

Imgur.prototype.upload = function(params, callback) {

  var defaultParams = {
    image: params.image,
    client_id: process.env.IMGUR_ID || params.client_id,
    client_secret: process.env.IMGUR_SECRET || params.client_secret
  };

  var data = querystring.stringify({
    image: defaultParams.image
  });

  var options = {
    host: 'api.imgur.com',
    port: 443,
    path: '/3/image',
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': 'Client-ID ' + defaultParams.client_id,
      'Content-Length': Buffer.byteLength(data)
    }
  };

  var req = http.request(options, function(res) {

    var responseData = '';

    res.on('data', function (chunk) {
      responseData += chunk;
    });

    res.on('end', function() {
      var jsonResponse = JSON.parse(responseData);
      callback(jsonResponse.data.link);

    });
  });

  req.on('error', function(e) {
    console.log('problem with request: ' + e.message);
  });

  req.write(data);
  req.end();
}

module.exports = new Imgur();
