const { no } = require('../../emoji.json');

module.exports = {
	slash: true,
	description: 'Lösche eine bestimmte Anzahl an Nachrichten!',
	options: [
		{
			name: 'Anzahl',
			description: 'Setze eine Anzahl zwischen 0 und 100 fest',
			type: 4,
			required: true,
		}
	],
	requiredPermissions: ['MANAGE_MESSAGES'],
	callback: ({ client, interaction, args }) => {
		const { channel_id } = interaction;
		const channel = client.channels.cache.get(channel_id);
		const amount = args.anzahl;
		if (amount <= 1 || amount > 99) {
			return no + ` Ungültiger Befehl, versuche es so: \`/prune <1-99>\``;
		}
		channel.messages.fetch({ limit: amount })
			.then(fetched => {
				const notPinned = fetched.filter(fetchedMsg => !fetchedMsg.pinned);
				channel.bulkDelete(notPinned, true);
				return 'Ich habe ' + amount + ' Nachrichten gelöscht.'
			})
			.catch(error => {
				console.log(error);
				return no + ' Error occured while running prune command.';
			});
	},
};