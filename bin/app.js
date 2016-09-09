'use strict';
let PORT = 8080,
    VIEWS_FOLDER = 'views/';

const Koa = require('koa'),
      Serve = require('koa-serve'),
      Fs = require('fs'),
      env = require('node-env-file')('.env');

let app = Koa();

app.use(Serve('src'));
app.use(Serve('node_modules'));

app.use(function *(next){
  var start = new Date;
  yield next;
  var ms = new Date - start;
  this.set('X-Response-Time', ms + 'ms');
});

app.use(function *(){
  this.body = Fs.readFileSync(VIEWS_FOLDER + 'index.html', 'utf-8');
});

app.listen(PORT);
console.log(`
  o-------o
 /|      /|
/ |     / |
o-|----o  |
| o----|--o
| /    | /
o------o
Go!
localhost:`+ PORT +`
  `);
//save user database also
var slackey = require('slackey');
var slackAPIClient = slackey.getAPIClient(process.env.SLACK_TOKEN);
slackAPIClient.send('search.messages',{
    query: 'has::pin:',
    count:100
  }, function(err, response) {

  // console.log('>', response);
  response.messages.matches.map((data)=>{
    console.log(data.channel.id);
    console.log(data.ts);
    slackAPIClient.send('reactions.get',{
      channel : data.channel.id,
      timestamp : data.ts
    }, (err, messageData) => {
      console.log('>>>', messageData.message.text);
      messageData.message.reactions.map((reaction)=>{
        console.log('> ', reaction);
      });
      console.log('_________');
    });
  })
});

var firebase = require("firebase");
firebase.initializeApp({
  serviceAccount: "firebase-config.json",
  databaseURL: "https://slackread.firebaseio.com"
});

var rootRef = firebase.database().ref();
rootRef.child("messages").on("value", function(snapshot) {
  console.log('>>>>>', snapshot.val());
});

var storage = firebase.storage();

// var webshot = require('webshot');
//
// webshot('github.io', 'google.png', function(err) {
//   // screenshot now saved to google.png
// });
