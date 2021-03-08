module.exports = {
	slash: 'both',
	callback: ({ client, message }) => {
		if (message) {
			message.channel.send(`:ping_pong: Pong! - **${Math.round(client.ws.ping)}ms**`);
		}
		return `:ping_pong: Pong! - **${Math.round(client.ws.ping)}ms**`;
	},
};