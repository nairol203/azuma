const Discord = require('discord.js');
const economy = require('../../features/economy');

module.exports = {
	minArgs: 2,
	maxArgs: 2,
	expectedArgs: '<user> <coins>',
	callback: async ({ message, args, instance }) => {
		const { guild, member } = message;
		const prefix = instance.getPrefix(guild);

		const target = message.mentions.users.first();
		if (!target) {
			message.channel.send(`<:no:767394810909949983> Ungültiger Befehl, versuche es so: \`${prefix}pay <user> <coins>\``);
			return;
		}

		const coinsToGive = args[1];
		if ((isNaN(args[0])) || args[0] < 1) {
			message.channel.send(`<:no:767394810909949983> Ungültiger Befehl, versuche es so: \`${prefix}pay <user> <coins>\``);
			return;
		}

		const coinsOwned = await economy.getCoins(member.id);
		if (coinsOwned < coinsToGive) {
			message.channel.send(`<:no:767394810909949983> Du hast nicht ${coinsToGive} coins!`);
			return;
		}

		const remainingCoins = await economy.addCoins(
			member.id,
			coinsToGive * -1,
		);
		const newBalance = await economy.addCoins(target.id, coinsToGive);

		const embed = new Discord.MessageEmbed()
			.setColor('#ffb800')
			.addField(`<a:Coin:795346652599812147>  |  **${message.author.username}**,`, `du hast <@${target.id}> bezahlt.\n<@${target.id}> hat jetzt **${newBalance}** Coin(s) und du hast noch **${remainingCoins}** Coin(s)!`);
		message.channel.send(embed);
	},
};
