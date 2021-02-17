const Discord = require('discord.js');
const music = require('./play');

module.exports = {
	callback: ({ message }) => {
		const serverQueue = music.serverQueue(message);

		if(!serverQueue) return message.channel.send('<:no:767394810909949983> | Es wird gerade nichts gespielt.');
		const embed = new Discord.MessageEmbed()
			.setTitle('Song Queue:')
			.setDescription(`${serverQueue.songs.map(song => `**-** \`${song.title}\``).join('\n')}

				**Now Playing:** \`${serverQueue.songs[0].title}\`
						`, { split: true })
			.setColor('#fabe00');
		message.channel.send(embed);
	},
};