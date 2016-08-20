const Botkit = require('botkit');
const BotkitStorageRedis = require('botkit-storage-redis');
const os = require('os');

const controller = Botkit.slackbot({
  debug: true,
  storage: BotkitStorageRedis( process.env.REDIS_URL || 'redis://localhost:6379/' ),
});
const bot = controller.spawn({ token: process.env.SLACK_TOKEN }).startRTM();

controller.hears(['hello', 'hi'], 'direct_message,direct_mention,mention', (bot, message) => {

  bot.api.reactions.add({
    timestamp: message.ts,
    channel: message.channel,
    name: 'robot_face',
  }, (err, res) => {
    if (err) {
      bot.botkit.log('Failed to add emoji reaction.', err);
    }
  });

  bot.reply(message, 'Hello.');
});
