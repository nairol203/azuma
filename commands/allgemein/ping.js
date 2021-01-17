module.exports = {
	callback: ({ message }) => {
		message.channel.send(':ping_pong: Pong!').then((resultMessage) => {
			const ping = resultMessage.createdTimestamp - message.createdTimestamp;
			resultMessage.edit(`:ping_pong: Pong! - **${ping} ms**`);
		});
	},
};