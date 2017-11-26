var express = require('express');
var app = express();

app.get('/p', function(req, res) {
  res.send("tagId is set to " + req.query.tagId);
});
  

  app.listen(3000);
  console.log('server up and running');