module.exports = {
	ownerOnly: true,
	callback: ({ client, args }) => {
		const arg = args.join(' ');
		client.user.setActivity('with depression', {
			type: 'LISTINING',
			url: arg,
		});
	},
};