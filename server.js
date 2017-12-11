
var http          = require('http');
var webtorrentify = require('webtorrentify-link');
var fs            = require('fs');
var url           = require("url");
var path          = require("path");
var validUrl      = require('valid-url');
var express       = require('express');
var getUrls       = require('get-urls');
var remote        = require('remote-file-size');
var app           = express();

var downloadLink;
var fileName;
var fileSize;
var server;
var parsed;
var param;
var link;
var port;
port = process.env.PORT || 80;

app.get('/favicon.ico', function(req, res){
console.log('favicon request recived');
});
app.get('*', function(req, res){
    if(req.url==='/'){
      app.use('/public/html', express.static(path.join(__dirname)));
  //   fs.readFile('public/html/index.html', function (err, data) {
  //   res.write(data);  
  // });
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
    
    //----------Finding File size----------------
    remote(downloadLink, function(err, o) {
      fileSize = (o/1024)/1024;
      console.log('size of ' + fileName + ' = ' + fileSize+" MB");  
    //-------------------------------------------
    if (fileSize < 501)
    {
      {
        app.use('/public/html/sucess.html', express.static(path.join(__dirname)));
        
      }
    ///////////////Creating Torrent////////////////////
    webtorrentify(downloadLink)
      .then(function (buffer) {
         console.log('creating the torrent');
         //res.send('what is');
         //-------------------------------------------
         res.setHeader('Content-Type', 'application/x-bittorrent');
         res.setHeader('Content-Disposition', `inline; filename="${fileName}.torrent"`);
         res.setHeader('Cache-Control', 'public, max-age=2592000'); // 30 days
         res.send(buffer);
         console.log(fileName+'.torrent created');
         res.end();
         //-------------------------------------------
      });
    ////////////////////////////////////////////////
    }
    else{
      console.log('More than 500 MB');
      res.send("<h4> More than 500 MB or invalid URL </h4>");
    }
  });
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

//http://www.fullstacktraining.com/articles/how-to-serve-static-files-with-express