const { MessageEmbed } = require('discord.js');
const YouTube = require('simple-youtube-api');
const youtube = new YouTube('AIzaSyB6QDXYXVDM-I7bwktzn6LOEn_71SubjHQ');
const music = require('./play');

module.exports = {
	slash: true,
	callback: async ({ client, interaction, args }) => {
		const searchString = args.song;

		const guild = client.guilds.cache.get(interaction.guild_id)
		const member = guild.members.cache.get(interaction.member.user.id);
		const voiceChannel = member.voice.channel;
		if(!voiceChannel) return '<:no:767394810909949983> | Du musst in einem Sprachkanal sein um diesen Command zu benutzen!';
		const permissons = voiceChannel.permissionsFor(client.user);
		if(!permissons.has('CONNECT')) return '<:no:767394810909949983> | Ich habe keine Berechtigung deinem Sprachkanal beizutreten!';
		if(!permissons.has('SPEAK')) return '<:no:767394810909949983> | Ich kann in deinem Sprachkanal nicht sprechen!';
		const channel = client.channels.cache.get(interaction.channel_id);

		try {
			const videos1 = await youtube.searchVideos(searchString, 10);
			let index = 0;
			const embed = new MessageEmbed()
				.setTitle('Suchergebnisse:')
				.setDescription(`${videos1.map(video2 => `**${++index}.** ${video2.title}`).join('\n')}`)
				.setFooter('Bitte wähle einen Song von 1-10 aus.')
				.setColor('#fabe00');
			channel.send(embed);
			try {
				var responce = await channel.awaitMessages(msg => msg.content > 0 && msg.content < 11, {
					max: 1,
					time: 30000,
					errors: ['time'],
				});
			}
			catch {
				return '<:no:767394810909949983> | Keine oder eine ungültige Eingabe erkannt.';
			}
			const videoIndex = parseInt(responce.first().content);
			var video = await youtube.getVideoByID(videos1[videoIndex - 1].id);
		}
		catch {
			return '<:no:767394810909949983> | Ich konnte keine passenden Suchergebnisse finden.';
		}
		return music.handleVideo(video, client, interaction, voiceChannel);
	},
};