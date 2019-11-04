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
  
}



function add(req, res) {
  if(req.url == '/login') {
    var htmlName = fs.readFileSync('./chapterList.html');
    res.writeHead(200, {'Content-Type': 'text/html'});
    res.end(htmlName);
    postlogin(req, res);
  }
  if(req.url =='/add'){
    postadd(req,res);
  }
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

function postadd(req, res){
  let essay = '';

  req.on('data', (data)=>{
    essay += data;
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
      author: essay.author || undefined,
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