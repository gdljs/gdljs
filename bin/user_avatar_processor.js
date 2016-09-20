'use strict';

const config = require('../config/config');

const Slackey = require('slackey'),
      Firebase = require('firebase'),
      slackApiClient = Slackey.getAPIClient(config.slack.token);

class UserAvatarsProcessor {

  sync () {
    this._remainingUsers = 0;
    Firebase.initializeApp({
      serviceAccount: config.firebase.serviceAccount,
      databaseURL: config.firebase.databaseURL
    });

    Firebase.database().ref(config.firebase.usersPath).on('value', function(snapshot) {
      Object.keys(snapshot.val()).map( (key) => {this._handleUser(snapshot.val()[key])} );
    }.bind(this));
  }

  _handleUser (user) {
    let  avatarUrl = user.profile.image_192 || user.profile.image_1024;
    if (avatarUrl){

      const fs = require('fs');
      const download = require('download');

      download(avatarUrl).then(data => {
        fs.writeFileSync(config.scratchFolder+user.id+'.jpg', data);
        console.log('>>>>');
      });
    }
  }

  // _handleIncomingUsers (err, response) {
  //   this._remainingUsers = response.members.length;
  //   response.members.map( function (userData) {
  //       const userId = userData.id;
  //       console.log('💾 🔄: ', userId);
  //       Firebase.database().ref(config.firebase.usersPath).child(userId).set(userData, function (snapshot) {
  //         console.log('💾 ✅: ', userId);
  //         this._remainingUsers--;
  //         this._checkForPendingMessages();
  //       }.bind(this));
  //   }.bind(this));
  // }
  //
  // _checkForPendingMessages () {
  //   if (this._remainingUsers) {
  //     return;
  //   }
  //   process.exit();
  // }

};

new UserAvatarsProcessor().sync();
