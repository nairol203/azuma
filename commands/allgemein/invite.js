const Discord = require('discord.js');

module.exports = {
	callback: ({ message }) => {
		const embed = new Discord.MessageEmbed()
			.addFields({ name: 'Invite-Link', value: 'Klicke [hier](https://discord.com/oauth2/authorize?client_id=772508572647030796&permissions=3156038&scope=bot) um Azuma auf deinen Server einzuladen!' })
			.setColor('#f77600');
		message.channel.send(embed);
	},
};