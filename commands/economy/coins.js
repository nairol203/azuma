const Discord = require('discord.js');
const economy = require('../../features/economy');

module.exports = {
	aliases: ['bal', 'balance', 'wallet'],
	maxArgs: 1,
	expectedArgs: '<user>',
	callback: async ({ message }) => {
		const target = message.mentions.users.first() || message.author;

		const userId = target.id;

		const coins = await economy.getCoins(userId);

		const embed = new Discord.MessageEmbed()
			.setColor('#ffb800')
			.addField(`<a:Coin:795346652599812147>  |  **${message.author.username}**,`, `${target} hat aktuell **${coins}** Coins.`);
		message.channel.send(embed);
	},
};
