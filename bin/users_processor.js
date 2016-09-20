'use strict';

const config = require('../config/config');

const Slackey = require('slackey'),
      Firebase = require('firebase'),
      slackApiClient = Slackey.getAPIClient(config.slack.token);

class UsersProcessor {

  get () {
    this._remainingUsers = 0;
    Firebase.initializeApp({
      serviceAccount: config.firebase.serviceAccount,
      databaseURL: config.firebase.databaseURL
    });
    slackApiClient.send('users.list', {    }, this._handleIncomingUsers.bind(this));
  }

  _handleIncomingUsers (err, response) {
    this._remainingUsers = response.members.length;
    response.members.map( function (userData) {
        const userId = userData.id;
        console.log('💾 🔄: ', userId);
        Firebase.database().ref(config.firebase.usersPath).child(userId).set(userData, function (snapshot) {
          console.log('💾 ✅: ', userId);
          this._remainingUsers--;
          this._checkForPendingMessages();
        }.bind(this));
    }.bind(this));
  }

  _checkForPendingMessages () {
    if (this._remainingUsers) {
      return;
    }
    process.exit();
  }

};

new UsersProcessor().get();
