module.exports = {
	ownerOnly: true,
	callback: ({ client, args }) => {
		const argument = args.join(' ');
		const arg = argument.toString().replace(args[1], '');
		client.user.setActivity(arg, { type: args[1] });
	},
};