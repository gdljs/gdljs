'use strict';

var request = require('request'),
    Promise = require('bluebird'),
    fs = require('fs'),
    config = JSON.parse(fs.readFileSync('config.json', 'utf-8')),
    starsEndpoint = config.starsEndpoint,
    userInfoEndpoint = config.userInfoEndpoint,

    userData = {},
    starData;


var process = new Promise(function(resolve, reject){
  request(starsEndpoint, function (error, response, body) {
      if (!error && response.statusCode == 200) {
        starData = JSON.parse(body);
        resolve(starData);
      }
  });
})

process.then(function(stars){
  var userUrls  = [];
  stars.items.forEach(function(star){

    // console.log('>>>', star.message.user);
    if(!star.message){
      return;
    }

    star.message.img = 'ast.png';

    userUrls.push(userInfoEndpoint+star.message.user);

    var mentions = star.message.text.match(/(?:^|\W)U0(\w+)(?!\w)/g);

    if(mentions && mentions.length){
      mentions.forEach(function(mention){
        userUrls.push(userInfoEndpoint+mention.replace('@',''));
      });
    }

  });

  return userUrls;
}).then(function(userUrls){

  return userUrls.map(function(url){
    return new Promise(function(resolve, reject){
      request(url, function (error, response, body) {
          if (!error && response.statusCode == 200) {
            resolve(JSON.parse(body));
          }
      });
    });
  });

}).then(function(promises){
  // console.log('>>>', promises);
  return new Promise(function(resolve, reject){
    Promise.settle(promises).then(function(results){

      results.forEach(function(result){
        var user = result.value().user;

        if(userData[user.id]){
          return;
        }

        userData[user.id] = user;
      });

      resolve(userData);
    });
  });
}).then(function(users){
  starData.users = users;
  starData.items.forEach(function(star){

    if(!star.message){
      return;
    }

    star.message.user = users[star.message.user];

  });

  var index = fs.readFileSync('index.tpl.html', 'utf-8');

  index = index.replace('{{data}}', JSON.stringify(starData));

  fs.writeFileSync('index.html', index);
  console.log('>done');

});
