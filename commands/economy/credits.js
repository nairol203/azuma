const Discord = require('discord.js');
const economy = require('../../features/economy');

module.exports = {
	aliases: ['bal', 'balance', 'wallet'],
	maxArgs: 1,
	expectedArgs: '<user>',
	callback: async ({ message }) => {
		const target = message.mentions.users.first() || message.author;
		if (target.bot) return;

		const guildId = message.guild.id;
		const userId = target.id;

		const coins = await economy.getCoins(guildId, userId);

		const embed = new Discord.MessageEmbed()
			.setColor('#ffb800')
			.addField(`💵  |  **${message.author.username}**,`, `${target} hat aktuell **${coins}** Credits.`);
		message.channel.send(embed);
	},
};
