// const Discord = require('discord.js');
const economy = require('../../features/economy');

module.exports = {
	aliases: ['coins'],
	maxArgs: 1,
	expectedArgs: '<user>',
	callback: async ({ message }) => {
		const target = message.mentions.users.first() || message.author;
		if (target.bot) return;

		const guildId = message.guild.id;
		const userId = target.id;

		const coins = await economy.getCoins(guildId, userId);

		/* const embed = new Discord.MessageEmbed()
			.setColor('#f77600')
			.addField(`💵  |  **${message.author.username}**,`, `${target} hat aktuell **${coins}** Credits.`);*/
		message.channel.send(`💵  |  **${target.username}**, du hast aktuell **${Intl.NumberFormat('de-DE', { maximumSignificantDigits: 3 }).format(coins)}** Credits.`);
	},
};
