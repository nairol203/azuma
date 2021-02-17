const music = require('./play');

module.exports = {
	aliases: 'np',
	callback: ({ message }) => {
		const serverQueue = music.serverQueue(message);
		message.channel.send(`:notes: | Now Playing: \`${serverQueue.songs[0].title}\``);
	},
};