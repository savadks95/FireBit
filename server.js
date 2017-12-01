
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
app.get('*', function(req, res){
    if(req.url==='/'){
    fs.readFile('public/html/index.html', function (err, data) {
    res.write(data);  
  });
  }else if (req.url === '/l?thelink='){
    fs.readFile('public/html/emptyRequest.html', function (err, data) {
      res.write(data);
      res.end();
  });
}else{
//---------Reciving Url--------------------
  console.log(req.query.thelink);
  downloadLink=req.query.thelink;
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
         console.log('creating the torrent');
         //-------------------------------------------
         res.setHeader('Content-Type', 'application/x-bittorrent');
         res.setHeader('Content-Disposition', `inline; filename="${fileName}.torrent"`);
         res.setHeader('Cache-Control', 'public, max-age=2592000'); // 30 days
         res.write(buffer);
         console.log(fileName+'.torrent created');
         res.end();
         //-------------------------------------------
         
      });
    ////////////////////////////////////////////////
  }
  else {
    console.log('not url');
    fs.readFile('public/html/404.html', function (err, data) {
      res.write(data);
      res.end();
    });
    
  }
}
});

app.listen(port);

console.log('server up and running', port);
   
//https://stackoverflow.com/questions/20089582/how-to-get-url-parameter-in-express-node-js