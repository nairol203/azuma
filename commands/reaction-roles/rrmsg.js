const messageSchema = require('../../schemas/message');
const { addToCache } = require('../../features/rr');

module.exports = {
	minArgs: 1,
	expectedArgs: '<text>',
	requiredPermissions: ['ADMINISTRATOR'],
	callback: async ({ message, args }) => {
		const { guild, mentions } = message;
		const { channels } = mentions;
		const targetChannel = channels.first() || message.channel;

		if (channels.first()) {
			args.shift();
		}

		const text = args.join(' ');

		const newMessage = await targetChannel.send(text);

		if (guild.me.hasPermission('MANAGE_MESSAGES')) {
			message.delete();
		}

		if (!guild.me.hasPermission('MANAGE_ROLES')) {
			message.reply(
				'Ich brauche die Berechtigung `MANAGE_ROLES` um diesen Befehl zu benutzen.',
			);
			return;
		}

		addToCache(guild.id, newMessage);

		new messageSchema({
			guildId: guild.id,
			channelId: targetChannel.id,
			messageId: newMessage.id,
		})
			.save()
			.catch(() => {
				message
					.reply('Failed to save to the database, please report this!')
					// eslint-disable-next-line no-shadow
					.then((message) => {
						message.delete({
							timeout: 1000 * 10,
						});
					});
			});
	},
};
