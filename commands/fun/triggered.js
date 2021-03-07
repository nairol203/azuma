const Discord = require('discord.js');
const canvacord = require('canvacord');

module.exports = {
	callback: async ({ message }) => {
		const target = message.mentions.users.first() || message.author;

		message.delete();
		const avatar = target.displayAvatarURL({ dynamic: false, format: 'png' });
		const image = await canvacord.Canvas.trigger(avatar);
		const attachment = new Discord.MessageAttachment(image, 'triggered.gif');
		return message.channel.send(attachment);
	},
};