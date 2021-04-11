module.exports = {
	minArgs: 1,
	maxArgs: 1,
	expectedArgs: '<1-99>',
	callback: ({ message, args }) => {
		const { channel } = message;
		const prefix = process.env.PREFIX;
		const amount = parseInt(args[0]) + 1;
		if (amount <= 1 || amount > 100) {
			return channel.send(`<:no:767394810909949983> Ungültiger Befehl, versuche es so: \`${prefix}prune <1-99>\``);
		}
		channel.messages.fetch({ limit: amount })
			.then(fetched => {
				const notPinned = fetched.filter(fetchedMsg => !fetchedMsg.pinned);
				channel.bulkDelete(notPinned, true);
			})
			.catch(error => {
				console.log(error);
				return channel.send('<:no:767394810909949983> Error occured while running prune command.');
			});
	},
};