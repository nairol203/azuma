module.exports = {
	slash: 'both',
	callback: ({ client, message }) => {
		if (message) {
			message.cannel.send('Der Befehl wurde zu einem Slash-Command geupdatet! Benutze von jetzt an `/ping`!')
			return;
		}
		return `:ping_pong: Pong! - **${Math.round(client.ws.ping)}ms**`;
	},
};