const music = require('./play');

module.exports = {
	callback: ({ message }) => {
		const serverQueue = music.serverQueue(message);

		if(!message.member.voice.channel) return message.channel.send('<:no:767394810909949983> | Du musst in einem Sprachkanal sein um diesen Command zu benutzen!');
		if(!serverQueue) return message.channel.send('<:no:767394810909949983> | Es wird gerade nichts gespielt');
		if(!serverQueue.playing) return message.channel.send('Die Musik ist schon pausiert.');
		serverQueue.playing = false;
		serverQueue.connection.dispatcher.pause();
		message.channel.send(':pause_button: | Die Musik wurde pausiert.');
	},
};