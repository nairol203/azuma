const music = require('./play');

module.exports = {
	callback: ({ message }) => {
		const serverQueue = music.serverQueue(message);

		if(!serverQueue) return message.channel.send('<:no:767394810909949983> | Es wird nichts gespielt');
		serverQueue.songs = [];
		serverQueue.connection.dispatcher.end();
		message.channel.send('Die Musik wurde gestoppt.');
	},
};