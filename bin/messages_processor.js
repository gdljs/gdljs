'use strict';

const config = require('../config/config');

const Slackey = require('slackey'),
      Firebase = require("firebase"),
      slackApiClient = Slackey.getAPIClient(config.slackToken);

class MessagesProcessor {
  get () {

    Firebase.initializeApp({
      serviceAccount: config.firebase.serviceAccount,
      databaseURL: config.firebase.databaseURL
    });

    slackApiClient.send('search.messages',{
      query: 'has::pin:',
      count:100
    }, this._handleIncomingMessages.bind(this));

    console.log('>>>', config.port);
    return;
  }

  _handleIncomingMessages (err, response) {

    response.messages.matches.map( function (data) {

      slackApiClient.send('reactions.get',{
        channel : data.channel.id,
        timestamp : data.ts
      }, this._handleMessage.bind(this));

    }.bind(this));

  }

  _handleMessage (err, messageData) {
    const messageId = messageData.channel + '-' + messageData.message.ts.replace(/\./g,'-');
    console.log('.>>> saving', messageId);
    Firebase.database().ref(config.firebase.messagesPath).child(messageId).set(messageData, function(snapshot) {
      console.log('Saved >>>>>', snapshot.val());
    });

  }
};

new MessagesProcessor().get();
