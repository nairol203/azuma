module.exports = {
	callback: ({ message, args }) => {
		const { channel } = message;
		if (args[0] === 'save') {
			channel.send('saving song...');
		}
		else if (args[0] === 'delete') {
			channel.send('deleting song...');
		}
	},
};