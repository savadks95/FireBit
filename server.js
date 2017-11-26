var http          = require('http');
var webtorrentify = require('webtorrentify-link');
var fs            = require('fs');
var url           = require("url");
var path          = require("path");
var validUrl      = require('valid-url');
var express       = require('express');
var getUrls       = require('get-urls');
var app           = express();

var downloadLink;
var fileName;
var server;
var parsed;
var param;
var link;
var port;
port = process.env.PORT || 3000;

app.get('/favicon.ico', function(req, res){
console.log('favicon request recived');
});
app.get('/', function(req, res){
  fs.readFile('public/html/index.html', function (err, data) {
    res.write(data);
    res.end();
  });
});
app.get('/l/:', function(req, res){
  fs.readFile('public/html/emptyRequest.html', function (err, data) {
    res.write(data);
    res.end();
  });
});
app.get('/l/:thelink*', function(req, res){
  res.send('what is');
  console.log('app.getUrls',app.getUrls);
  //---------Reciving Url--------------------
  // param = url.parse(req.url, true).query;
  console.log(req.params.thelink);
  downloadLink=req.params.thelink;
  
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
  }
  else {
    console.log('not url');
    // fs.readFile('public/html/404.html', function (err, data) {
    //   res.write(data);
    //   res.end();
    // });
    //
  }
});
//------------------404--------------
app.get('*', function(req, res){
  res.send('what...error 404', 404);
});
//------------------------------------

app.listen(port);

console.log('server up and running', port);
// if (app.get === '/favicon.ico', function(req, res){
//    console.log('favicon');
//  }) {
//     console.log('favicon request recived');
//   } 

//   else if (app.get === '/', function(req, res){
//     fs.readFile('public/html/index.html', function (err, data) {
//       res.write(data);
//       res.end();
//     });
//   }) {
    
//   } 

// app.get('/json', function(req, res){
//     res.json({firstname:'John', lastname:'Doe'});
// });

//---------------------------------------------------
// server = http.createServer(function (req, res) {

//   res.writeHead(200, {
//     'Content-Type': 'text/html'
//   });

//   if (req.url === '/favicon.ico') {
//     console.log('favicon request recived');
//   } 

//   else if (req.url === '/') {
//     fs.readFile('index.html', function (err, data) {
//       res.write(data);
//       res.end();
//     });
//   } 

//   else if (req.url === "/?thelink=") {
//     fs.readFile('emptyRequest.html', function (err, data) {
//       res.write(data);
//       res.end();
//     });
//     console.log('elseif');
//   }
  
//   else {

//     //---------Reciving Url--------------------
//     params = url.parse(req.url, true).query;
//     console.log(params);
//     downloadLink = params.thelink;
//     //-----------------------------------------
//     //------------checking for valid url-------
//     if (validUrl.isUri(downloadLink)) {
//       console.log('Looks like an URI');

//       //-----------------------------------------
//       //----------Extracting filename-------------
//       parsed = url.parse(downloadLink);
//       fileName = path.basename(parsed.pathname);
//       console.log(path.basename(parsed.pathname));
//       //-------------------------------------------
//       ///////////////Creating Torrent////////////////////
//       webtorrentify(downloadLink)
//         .then(function (buffer) {
//            fs.writeFileSync(fileName + '.torrent', buffer);
//            console.log('creating the torrent');
//         });
//       ////////////////////////////////////////////////
      
//       //------------------Test------------------------------
      
//       //----------------------------------------------------
//     }
//     else {
//       fs.readFile('invalidUrl.html', function (err, data) {
//         res.write(data);
//         res.end();
//       });
//       console.log('Not a URI');
//     }
//     //res.end();

//   }
// });
// server.listen(3000);
// console.log('server up and running');
//https://stackoverflow.com/questions/20089582/how-to-get-url-parameter-in-express-node-js