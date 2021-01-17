module.exports = {
	aliases: ['coin'],
	callback: ({ message }) => {
		message.channel.send('<a:Coin:795346652599812147>*flipping...*');
		const messages = [
			'es ist Zahl!',
			'es ist Kopf!',
		];
		const randomMessage = messages[Math.floor(Math.random() * messages.length)];
		setTimeout(function() {
			return message.reply(randomMessage);
		}, 1500);
	},
};