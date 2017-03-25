var path = require('path');
var childProcess = require('child_process');
var phantomjs = require('phantomjs');
var binPath = phantomjs.path;
var fs = require('fs');
var YSLOW = require('yslow').YSLOW;
var doc = require('jsdom').jsdom();
var express = require('express');

var app = express();

const PORT = process.env.PORT || 8000;


function handleRequest(req, res){
   var URL = req.query.url;
    var childArgs = [
      path.join(__dirname, 'netsniff.js'),
      URL
    ]
    childProcess.execFile(binPath, childArgs, function(err, stdout, stderr) {
        if (err){
           res.status(404).send('Url is not valid');
        }
        else
        {
          var har = JSON.parse(stdout),
          resource = YSLOW.harImporter.run(doc, har),
          content = YSLOW.util.getResults(resource.context, 'all');
          res.json(content);
        }
    });
}
app.get('/', handleRequest)

app.listen(PORT, function(){
   console.log("The server is listenning on port " + PORT);
})




 
    

