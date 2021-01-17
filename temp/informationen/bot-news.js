module.exports = {
	testOnly: true,
	callback: ({ message }) => {
		const Discord = require('discord.js');
		const embed = new Discord.MessageEmbed()
			.setColor('#f77600')
			.setTitle('Bot-News:')
			.setDescription('Aktuell werden von diesen Bot\'s News in <#788079200320880702> gepostet:\n- <@159985870458322944> \n- <@235088799074484224> \n- <@172002275412279296> \n- <@275813801792634880>');
		return message.channel.send(embed);
	},
};