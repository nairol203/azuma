module.exports = {
	expectedArgs: '<1-99>',
	minArgs: 1,
	maxArgs: 1,
	requiredPermissions: ['MANAGE_MESSAGES'],
	callback: ({ message, args, instance }) => {
		const prefix = instance.getPrefix(message.guild);

		if(!message.member.hasPermission('MANAGE_MESSAGES')) return;

		const amount = parseInt(args[0]) + 1;

		if (amount <= 1 || amount > 100) {
			return message.channel.send(`<:no:767394810909949983> Ungültiger Befehl, versuche es so: \`${prefix}prune <1-99>\``);
		}

		message.channel.bulkDelete(amount, true).catch(error => {
			console.error(error);
			return message.channel.send('<:no:767394810909949983> Error occured while running prune command.');
		});
	},
};