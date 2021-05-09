const economy = require('../../features/economy');
const { no } = require('../../emoji.json');

module.exports = {
  minArgs: 2,
  maxArgs: 2,
  expectedArgs: "<The target's @> <coin amount>",
  callback: async ({ message, args }) => {
    const mention = message.mentions.users.first();
    if (mention.bot) return;
    const userId = mention.id
    const coins = args[1];
    const guildId = message.guild.id
    await economy.addCoins(guildId, userId, coins).catch(e => console.error(e))
  },
}
