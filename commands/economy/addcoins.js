const Discord = require('discord.js');
const economy = require('../../features/economy');

module.exports = {
	aliases: 'addbal',
	minArgs: 2,
	maxArgs: 2,
	expectedArgs: '<user> <coins>',
	requiredPermissions: ['ADMINISTRATOR'],
	callback: async ({ message, args, instance }) => {
		const guild = message.guild;
		const prefix = instance.getPrefix(guild);

		const mention = message.mentions.users.first();

		if (!mention) {
			message.channel.send(`<:no:767394810909949983> Ungültiger Befehl, versuche es so: \`${prefix}addcoins <user> <coins>\``);
			return;
		}

		const coins = args[1];
		if (isNaN(coins)) {
			message.channel.send(`<:no:767394810909949983> Ungültiger Befehl, versuche es so: \`${prefix}addcoins <user> <coins>\``);
			return;
		}

		const userId = mention.id;

		const newCoins = await economy.addCoins(userId, coins);

		const embed = new Discord.MessageEmbed()
			.setColor('#ffb800')
			.addField(`<a:Coin:795346652599812147>  |  **${message.author.username}**,`, `du hast <@${userId}> **${coins}** Coin(s) gegeben.\n<@${userId}> hat jetzt **${newCoins}** Coin(s)!`);
		message.channel.send(embed);
	},
};
