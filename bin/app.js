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



var storage = firebase.storage();

var webshot = require('webshot');

var uuid = require('uuid4');

// Generate a new UUID
var id = uuid();

webshot('github.io', 'google.png', function(err) {
  // screenshot now saved to google.png
  // Get a reference to the storage service, which is used to create references in your storage bucket
  var storage = firebase.storage();

  // Create a storage reference from our storage service
  var storageRef = storage.ref();
});
