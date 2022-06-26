 const Slack = require('slack-node');
 let slack;
 
 class SlackW {
   static initialize(configs) {
     slack = new Slack();
     slack.setWebhook(configs.webhookUri);
   }
 
//    static postMessage(channel, username, text) {
//      return new Promise((resolve, reject) => {
//        slack.webhook({
//          channel: channel,
//          username: username,
//          text: text,
//        }, function(err, response) {
//          if (err) {
//            return reject(err);
//          }
//          return resolve(response);
//        });
//      });
//    }
 
   static postMessageWithWebhook(channel, username, text, webhookURL) {
     // <user name:email> has completed the task(<task title>) got <points> points, assigned by <assigner name: email>
     // <user name: email> has created the task(<task title>), assigned to <assigne: email>, with <points> points and <priority> priority. Deadline is <deadline>.
     let slackWebhook = new Slack();
     slackWebhook.setWebhook(webhookURL);
     return new Promise((resolve, reject) => {
       slackWebhook.webhook({
         channel: channel,
         username: username,
         text: text,
       }, function(err, response) {
         if (err) {
           return reject(err);
         }
         return resolve(response);
       });
     });
   }
 }
 
 module.exports = SlackW;
 