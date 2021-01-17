module.exports = {
	callback: ({ message }) => {
		const Discord = require('discord.js');
		const embed = new Discord.MessageEmbed()
			.setColor('#f77600')
			.setTitle('Status-Updates:')
			.setDescription('Aktuell werden von diesen Bot\'s Status-Updates in <#701803236432150548> gepostet:\n- <@159985870458322944>\n- <@172002275412279296>\n- <@235088799074484224>');
		return message.channel.send(embed);
	},
};