
var express = require('express');
var debug = require('debug')('Blog:server');
var router = express.Router();
var users = require('../data.json');

router.get('/', function(req, res){
  res.render('login');
  console.log(users.users);
});

router.post('/', function(req, res){
  if(isLegalUser(req)) {
    //console.log(isLegal);
    res.render('list',{items:users.chapterList});
  } else {
    //res.render('error');
    res.send('用户名或密码错误！')
    //res.render('login');
  }
});

function isLegalUser(req) {
  var user = {
    'username': req.body.username, 
    'password': req.body.pwd
  };

  var isLegal = false;

  for(var i = 0; i < users.users.length; i++) {
    if(users.users[i].username === user.username && users.users[i].password === user.password) {
      isLegal = true;
      break;
    }
  }

  return isLegal;
}

module.exports = router;