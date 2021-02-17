const music = require('./play');

module.exports = {
	minArgs: 0,
	maxArgs: 1,
	expectedArgs: '<number>',
	aliases: 'vol',
	callback: ({ message, args }) => {
		const serverQueue = music.serverQueue(message);

		if(!message.member.voice.channel) return message.channel.send('<:no:767394810909949983> | Du musst in einem Sprachkanal sein um diesen Command zu benutzen!');
		if(!serverQueue) return message.channel.send('<:no:767394810909949983> | Es wird gerade nichts gespielt');
		if(!args[0]) return message.channel.send(`Die Lautstärke des Bot's ist **${serverQueue.volume}**.`);
		if(isNaN(args[0])) return message.channel.send('<:no:767394810909949983> | Keine gültige Eingabe erkannt.');
		serverQueue.volume = args[0];
		serverQueue.connection.dispatcher.setVolumeLogarithmic(args[1] / 5);
		message.channel.send(`Die Lautstärke wurde zu **${args[0]}** geändert.`);
	},
};