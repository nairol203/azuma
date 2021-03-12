module.exports = {
	slash: true,
	description: 'Pong!',
	callback: ({ client }) => {
		return `:ping_pong: Pong! - **${Math.round(client.ws.ping)}ms**`;
	},
};