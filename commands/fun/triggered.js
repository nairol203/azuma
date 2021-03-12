const canvacord = require('canvacord');
const { MessageAttachment } = require('discord.js');

module.exports = {
	slash: true,
	description: 'Erzeuge ein getriggertes GIF von deinem Profilbild!',
	callback: async ({ interaction }) => {
		const user = interaction.member.user;
		const avatar = 'https://cdn.discordapp.com/avatars/' + user.id + '/' + user.avatar + '.png'
		const image = await canvacord.Canvas.trigger(avatar);
		const attachment = new MessageAttachment(image, 'triggered.gif');
		return attachment;
	},
};