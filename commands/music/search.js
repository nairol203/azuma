const { MessageEmbed } = require('discord.js');
const { no } = require('../../emoji.json');
const { handleVideo } = require('../../features/music');
const YouTube = require('simple-youtube-api');
const youtube = new YouTube('AIzaSyB6QDXYXVDM-I7bwktzn6LOEn_71SubjHQ');

module.exports = {
	description: 'Spiele Musik in einem Sprachkanal ab!',
	options: [
		{
			name: 'song',
			description: 'Name des Songs',
			type: 3,
			required: true,
		},
	],
	callback: async ({ client, interaction, args }) => {
		const searchString = args.song;

		const guild = client.guilds.cache.get(interaction.guild_id)
		const member = guild.members.cache.get(interaction.member.user.id);
		const voiceChannel = member.voice.channel;
		if(!voiceChannel) return [ no + ' Du musst in einem Sprachkanal sein um diesen Command zu benutzen!' ];
		const permissons = voiceChannel.permissionsFor(client.user);
		if(!permissons.has('CONNECT')) return [ no + ' Ich habe keine Berechtigung deinem Sprachkanal beizutreten!' ];
		if(!permissons.has('SPEAK')) return [ no + ' Ich kann in deinem Sprachkanal nicht sprechen!' ];
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
				return [ no + ' Keine oder eine ungültige Eingabe erkannt.' ];
			}
			const videoIndex = parseInt(responce.first().content);
			var video = await youtube.getVideoByID(videos1[videoIndex - 1].id);
		}
		catch {
			return [ no + ' Ich konnte keine passenden Suchergebnisse finden.' ];
		}
		return handleVideo(video, client, interaction, voiceChannel);
	},
};