module.exports = {
	ownerOnly: true,
	aliases: 'kill',
	callback: ({ client, message }) => {
		message.channel.send('Restarting...');
		client.destroy();
		client.login(process.env.TOKEN);
	},
};