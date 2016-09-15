'use strict';

module.exports = {
  port : '3000',
  slack : {
    token : 'xoxp-...',
    messagesQuery : 'has::pin:'
  },
  firebase : {
    serviceAccount: 'config/firebase-config.json',
    databaseURL: 'https://<your-firebase>.firebaseio.com',
    messagesPath : '/messages',
    emojisPath : '/emojis',
    usersPath : '/users'
  }
};
