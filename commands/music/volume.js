const music = require('./play');

module.exports = {
	minArgs: 0,
	maxArgs: 1,
	expectedArgs: '<number>',
	aliases: 'vol',
	callback: ({ message, args }) => {
		const serverQueue = music.serverQueue(message);

		if(!args.length) return message.channel.send(`Die Lautstärke des Bot's ist **${serverQueue.volume}**.`);
		if(isNaN(args[0])) return message.channel.send('<:no:767394810909949983> | Keine gültige Eingabe erkannt.');
		const amount = parseInt(args[0]);
		if (amount > 5) return message.channel.send('Wenn du dir die Ohren wegschallern willst hör lieber Metal!');

		if(!message.member.voice.channel) return message.channel.send('<:no:767394810909949983> | Du musst in einem Sprachkanal sein um diesen Command zu benutzen!');
		if(!serverQueue) return message.channel.send('<:no:767394810909949983> | Es wird gerade nichts gespielt');
		serverQueue.volume = amount;
		serverQueue.connection.dispatcher.setVolumeLogarithmic(amount / 5);
		message.channel.send(`Die Lautstärke wurde zu **${amount}** geändert.`);
	},
};