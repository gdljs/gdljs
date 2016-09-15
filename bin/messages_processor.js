'use strict';

const config = require('../config/config');

const Slackey = require('slackey'),
      Firebase = require('firebase'),
      slackApiClient = Slackey.getAPIClient(config.slack.token);

class MessagesProcessor {

  get () {
    this._remainingMessages = 0;
    Firebase.initializeApp({
      serviceAccount: config.firebase.serviceAccount,
      databaseURL: config.firebase.databaseURL
    });
    slackApiClient.send('search.messages', {
      query: config.slack.messagesQuery,
      count:100
    }, this._handleIncomingMessages.bind(this));
  }

  _handleIncomingMessages (err, response) {
    this._remainingMessages = response.messages.matches.length;
    response.messages.matches.map( function (data) {
      slackApiClient.send('reactions.get', {
        channel : data.channel.id,
        timestamp : data.ts
      }, this._handleMessage.bind(this));
    }.bind(this));
  }

  _handleMessage (err, messageData) {
    const messageId = messageData.channel + '-' + messageData.message.ts.replace(/\./g,'-');
    console.log('💾 🔄: ', messageId);
    Firebase.database().ref(config.firebase.messagesPath).child(messageId).set(messageData, function (snapshot) {
      console.log('💾 ✅: ', messageId);
      this._remainingMessages--;
      this._checkForPendingMessages();
    }.bind(this));
  }

  _checkForPendingMessages () {
    if (this._remainingMessages) {
      return;
    }
    process.exit();
  }

};

new MessagesProcessor().get();
