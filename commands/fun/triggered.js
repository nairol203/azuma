const Discord = require('discord.js');
const canvacord = require('canvacord');

module.exports = {
	callback: async ({ message }) => {
		message.delete();
		const avatar = message.author.displayAvatarURL({ dynamic: false, format: 'png' });
		const image = await canvacord.Canvas.trigger(avatar);
		const attachment = new Discord.MessageAttachment(image, 'triggered.gif');
		return message.channel.send(attachment);
	},
};