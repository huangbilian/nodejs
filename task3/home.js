const http = require('http'),
      fs   = require('fs'),
      log  = console.log,
      qs   = require('querystring'),
      path = require('path'),
      URL = require('url');

const { chapterList} = require('./data');

var userList = [
    {username: "admin", pwd: "admin"}
]

http.createServer(function(req, res) {
  log(`${req.method} ${req.url} HTTP/${req.httpVersion}`);
  log(req.headers);
  log('');

  switch(req.method) {
    case 'GET':
      show(req, res);
      break;

    case 'POST':
      add(req, res);
      break;

    default:
      err(res);
      break;
  }
}).listen(8083);


function show(req, res) {
  if(req.url == '/list') {
    var htmlName = fs.readFileSync('./chapterList.html');
    res.writeHead(200, {'Content-Type': 'text/html'});
    res.end(htmlName);
  }
  else if(URL.parse(req.url).pathname == '/detail'){
    Id=URL.parse(req.url).query.replace(/chapterId=/,"")-1;
    var htmlName = fs.readFileSync('./chapter.html');
    res.writeHead(200, {'Content-Type': 'text/html'});
    res.end(htmlName);
  }
  else if(req.url == '/login') {
    var htmlName = fs.readFileSync('./login.html');
    res.writeHead(200, {'Content-Type': 'text/html'});
    res.end(htmlName);
  }
  else if(req.url == '/listmanager') {
    var htmlName = fs.readFileSync('./list.html');
    res.writeHead(200, {'Content-Type': 'text/html'});
    res.end(htmlName);
  }
  else if(req.url == '/addChapter') {
    var htmlName = fs.readFileSync('./addChapter.html');
    res.writeHead(200, {'Content-Type': 'text/html'});
    res.end(htmlName);
  }
  else if(req.url != '/'){
    var cpurl = '.'+req.url;
    res.writeHead(200, {'Content-type':"text/css"});
    fs.readFile(cpurl, function(err, data) {
      res.end(data);
    });
  }
}



function add(req, res) {
  var htmlName = fs.readFileSync('./login.html');
    res.writeHead(200, {'Content-Type': 'text/html'});
    res.end(htmlName);
    postlogin(req, res);
}
  
function postlogin(req, res){
  let user = '';
  let f = 0;
  req.on('data', (data)=>{
    user += data;
  });
  req.on('end', ()=>{
    userList.map((item)=>{
      if(item.username == user.name && item.pwd == user.pswd){
        f= 1;
        res.statusCode = 200;
        res.end('OK');
      }
    });
    if(f == 0){
      res.statusCode = 404;
      res.end('ERROR')
    }
  });
}


function err(res) {
    var msg = 'Not found';
    res.writeHead(404, {
      'Content-Length': msg.length,
      'Content-Type': 'text/plain'
    });
    res.end(msg);
}