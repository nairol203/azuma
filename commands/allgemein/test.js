module.exports = {
    update: true,
	slash: true,
	description: 'Test 1 - 2 -3!',
	callback: ({ client }) => {
		console.log(`:ping_pong: Pong! - **${Math.round(client.ws.ping)}ms**`);
	},
};