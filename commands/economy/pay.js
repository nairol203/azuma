const Discord = require('discord.js');
const economy = require('../../features/economy');

module.exports = {
	minArgs: 2,
	maxArgs: 2,
	expectedArgs: '<user> <credits>',
	callback: async ({ message, args, instance }) => {
		const { guild, member } = message;
		const prefix = instance.getPrefix(guild);

		const target = message.mentions.users.first();
		if (!target) {
			message.channel.send(`<:no:767394810909949983> Ungültiger Befehl, versuche es so: \`${prefix}pay <user> <credits>\``);
			return;
		}
		if (target.bot) return;

		const coinsToGive = args[1];
		if ((isNaN(args[0])) || args[0] < 1) {
			message.channel.send(`<:no:767394810909949983> Ungültiger Befehl, versuche es so: \`${prefix}pay <user> <credits>\``);
			return;
		}

		const coinsOwned = await economy.getCoins(guild.id, member.id);
		if (coinsOwned < coinsToGive) {
			message.channel.send(`<:no:767394810909949983> Du hast nicht ${coinsToGive} credits!`);
			return;
		}

		const remainingCoins = await economy.addCoins(
			guild.id,
			member.id,
			coinsToGive * -1,
		);
		const newBalance = await economy.addCoins(guild.id, target.id, coinsToGive);

		const embed = new Discord.MessageEmbed()
			.setColor('#f77600')
			.addField(`💵  |  **${message.author.username}**,`, `du hast <@${target.id}> bezahlt.\n<@${target.id}> hat jetzt **${newBalance}** Credit(s) und du hast noch **${remainingCoins}** Credit(s)!`);
		message.channel.send(embed);
	},
};
