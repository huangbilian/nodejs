const http = require('http'),
      fs   = require('fs'),
      log  = console.log,
      qs   = require('querystring'),
      path = require('path'),
      URL = require('url');

const { chapterList} = require('./data');

//Id = 0;

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
    case 'DELETE':
      remove(req, res);
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
    //Id=URL.parse(req.url).query.replace(/chapterId=/,"")-1;
    var htmlName = fs.readFileSync('./chapter.html');
    res.writeHead(200, {'Content-Type': 'text/html'});
    res.end(htmlName);
  }
  else if(URL.parse(req.url).pathname == '/getDetail'){
    let Id=URL.parse(req.url,true).query.chapterId-1;
    var m = chapterList[Id];
    //log(m);
    res.writeHead(200, {'Content-Type': 'text/json'});
    res.end(JSON.stringify(m));
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
  else if(req.url == '/data'){
    res.write(JSON.stringify(chapterList));
    res.end();
  }
  else if(req.url != '/'){
    var cpurl = '.'+req.url;
    res.writeHead(200, {'Content-type':"text/css"});
    fs.readFile(cpurl, function(err, data) {
      res.end(data);
    });
  }
  else{
    res.end('ERROR');
  }
  
}



function add(req, res) {
  if(req.url == '/login') {
    //登录
    var htmlName = fs.readFileSync('./chapterList.html');
    res.writeHead(200, {'Content-Type': 'text/html'});
    res.end(htmlName);
    postlogin(req, res);
  }
  else if(req.url =='/add'){
    postadd(req,res);
  }
}
  
function postlogin(req, res){
  var user = '';
  let f = 0;
  req.on('data', (item)=>{
    user += item;
  });
  req.on('end', ()=>{
    userList.map((item)=>{
      if(item.username == user.name && item.pwd == user.pswd){
        f= 1;
        res.statusCode = 200;
        res.end('OK');
      }
      else{
        log('Username Or Password Error');
      }
    });
    if(f == 0){
      res.statusCode = 404;
      res.end('ERROR')
    }
  });
}

function postadd(req, res){
  var essay = '';

  req.on('data', (item)=>{
    essay += item;
  });

  req.on('end', ()=>{
    essay = qs.parse(essay.toString('utf8'));
    let item = {
      chapterId: chapterList.length+1,
      chapterName: essay.title || '',
      imgPath: essay.imgPath || undefined,
      chapterDes: essay.chapterDes || undefined,
      chapterContent: essay.content || '',
      publishTimer: new Date().getTime(),
      author: essay.author,
      views: 1,
    }
    chapterList.push(item);
    //fs.writeFileSync('./data.js', JSON.stringify(chapterList));
  })
  res.write(JSON.stringify(chapterList));
  res.end('OK');
}


function err(res) {
    var msg = 'Not found';
    res.writeHead(404, {
      'Content-Length': msg.length,
      'Content-Type': 'text/plain'
    });
    res.end(msg);
}