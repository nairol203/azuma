const Discord = require('discord.js');
const canvacord = require('canvacord');

module.exports = {
	slash: true,
	callback: async ({ interaction }) => {
		const target = interaction.member.user;

		message.delete();
		const avatar = target.displayAvatarURL({ dynamic: false, format: 'png' });
		const image = await canvacord.Canvas.trigger(avatar);
		const attachment = new Discord.MessageAttachment(image, 'triggered.gif');
		return attachment;
	},
};