var http          = require('http');
var webtorrentify = require('webtorrentify-link');
var fs            = require('fs');
var url           = require("url");
var path          = require("path");
var validUrl      = require('valid-url');
var express       = require ('express');
var app           = express();

var downloadLink;
var fileName;
var server;
var parsed;
var params;
var link;

server = http.createServer(function (req, res) {

  res.writeHead(200, {
    'Content-Type': 'text/html'
  });

  if (req.url === '/favicon.ico') {
    console.log('favicon request recived');
  } 

  else if (req.url === '/') {
    fs.readFile('public/html/index.html', function (err, data) {
      res.write(data);
      res.end();
    });
  } 

  else if (req.url === "/?thelink=") {
    fs.readFile('public/html/emptyRequest.html', function (err, data) {
      res.write(data);
      res.end();
    });
    console.log('elseif');
  }
  
  else {

    //---------Reciving Url--------------------
    params = url.parse(req.url, true).query;
    console.log(params);
    downloadLink = params.thelink;
    //-----------------------------------------
    //------------checking for valid url-------
    if (validUrl.isUri(downloadLink)) {
      console.log('Looks like an URI');

      //-----------------------------------------
      //----------Extracting filename-------------
      parsed = url.parse(downloadLink);
      fileName = path.basename(parsed.pathname);
      console.log(path.basename(parsed.pathname));
      //-------------------------------------------
      ///////////////Creating Torrent////////////////////
      webtorrentify(downloadLink)
        .then(function (buffer) {
           fs.writeFileSync(fileName + '.torrent', buffer);
           console.log('creating the torrent');
        });
      ////////////////////////////////////////////////
      
      //------------------Test------------------------------
      
      //----------------------------------------------------
    }
    else {
      fs.readFile('public/html/404.html', function (err, data) {
        res.write(data);
        res.end();
      });
      console.log('Not a URI');
    }
    //res.end();

  }
});
server.listen(3000);
console.log('server up and running');