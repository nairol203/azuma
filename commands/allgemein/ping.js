module.exports = {
	slash: true,
	callback: ({ client }) => {
		return `:ping_pong: Pong! - **${Math.round(client.ws.ping)}ms**`;
	},
};