module.exports = {
	requiredPermissions: ['ADMINISTRATOR'],
	callback: async ({ message }) => {
		const channelIds = [];

		// eslint-disable-next-line no-shadow
		const addReactions = (message) => {
			message.react('👍');

			setTimeout(() => {
				message.react('👎');
			}, 750);
		};

		if (channelIds.includes(message.channel.id)) {
			addReactions(message);
		}
		await message.delete();
		const fetched = await message.channel.messages.fetch({ limit: 1 });
		if (fetched && fetched.first()) {
			addReactions(fetched.first());
		}
	},
};