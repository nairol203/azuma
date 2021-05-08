const economy = require('../../features/economy');

module.exports = {
  minArgs: 2,
  maxArgs: 2,
  expectedArgs: "<The target's @> <coin amount>",
  callback: async (message, args) => {
    const coins = args[1]
    const guildId = message.guild.id
    const userId = args[0]

    const newCoins = await economy.addCoins(guildId, userId, coins)

    message.reply(
      `You have given <@${userId}> ${coins} coin(s). They now have ${newCoins} coin(s)!`
    )
  },
}
