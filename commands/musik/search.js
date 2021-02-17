const Discord = require('discord.js');
const YouTube = require('simple-youtube-api');
const youtube = new YouTube('AIzaSyB6QDXYXVDM-I7bwktzn6LOEn_71SubjHQ');
const music = require('./play');

module.exports = {
	callback: async ({ message, args }) => {
		const searchString = args.join(' ');
		const voiceChannel = message.member.voice.channel;
		if(!voiceChannel) return message.channel.send('<:no:767394810909949983> | Du musst in einem Sprachkanal sein um diesen Command zu benutzen!');
		const permissons = voiceChannel.permissionsFor(message.client.user);
		if(!permissons.has('CONNECT')) return message.channel.send('<:no:767394810909949983> | Ich habe keine Berechtigung deinem Sprachkanal beizutreten!');
		if(!permissons.has('SPEAK')) return message.channel.send('<:no:767394810909949983> | Ich kann in deinem Sprachkanal nicht sprechen!');

		try {
			const videos1 = await youtube.searchVideos(searchString, 10);
			let index = 0;
			const embed = new Discord.MessageEmbed()
				.setTitle('Suchergebnisse:')
				.setDescription(`${videos1.map(video2 => `**${++index}.** ${video2.title}`).join('\n')}`)
				.setFooter('Bitte wähle einen Song von 1-10 aus.')
				.setColor('#fabe00');
			message.channel.send(embed);
			try {
				var responce = await message.channel.awaitMessages(msg => msg.content > 0 && msg.content < 11, {
					max: 1,
					time: 30000,
					errors: ['time'],
				});
			}
			catch {
				message.channel.send('<:no:767394810909949983> | Keine oder eine ungültige Eingabe erkannt.');
			}
			const videoIndex = parseInt(responce.first().content);
			var video = await youtube.getVideoByID(videos1[videoIndex - 1].id);
		}
		catch {
			return message.channel.send('<:no:767394810909949983> | Ich konnte keine passenden Suchergebnisse finden.');
		}
		return music.handleVideo(video, message, voiceChannel);
	},
};