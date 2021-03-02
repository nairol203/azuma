module.exports = {
	minArgs: 1,
	maxArgs: 2,
	callback: ({ message, args }) => {
		return message.channel.send(args);
	},
};