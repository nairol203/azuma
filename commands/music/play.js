const { no } = require('../../emoji.json');
const { handleVideo } = require('../../features/music');
const YouTube = require('simple-youtube-api');
const youtube = new YouTube('AIzaSyB6QDXYXVDM-I7bwktzn6LOEn_71SubjHQ');

module.exports = {
	description: 'Spiele Musik in einem Sprachkanal ab!',
	options: [
		{
			name: 'song',
			description: 'Name oder Link des Songs',
			type: 3,
			required: true,
		},
	],
	callback: async ({ client, args, interaction }) => {
		const searchString = args.song;
		const guild = client.guilds.cache.get(interaction.guild_id)
		const member = guild.members.cache.get(interaction.member.user.id);
		const voiceChannel = member.voice.channel;
		if(!voiceChannel) return  no + ' | Du musst in einem Sprachkanal sein um diesen Command zu benutzen!';
		const permissons = voiceChannel.permissionsFor(client.user);
		if(!permissons.has('CONNECT')) return  no + ' | Ich habe keine Berechtigung deinem Sprachkanal beizutreten!';
		if(!permissons.has('SPEAK')) return  no + ' | Ich kann in deinem Sprachkanal nicht sprechen!';

		if(searchString.match(/^https?:\/\/(www.youtube.com|youtube.com)\/playlist(.*)$/)) {
			const playList = await youtube.getPlaylist(searchString);
			const videos = await playList.getVideos();
			for (const video of Object.values(videos)) {
				const video2 = await youtube.getVideoByID(video.id);
				await handleVideo(video2, client, interaction, voiceChannel, true);
			}
		}
		else {
			try {
				var video = await youtube.getVideoByID(searchString);
			}
			catch {
				try {
					const videos = await youtube.searchVideos(searchString, 1);
					var video = await youtube.getVideoByID(videos[0].id);
				}
				catch {
					return  no + ' | Ich konnte keine passenden Suchergebnisse finden.';
				}
			}
			return handleVideo(video, client, interaction, voiceChannel);
		}
	},
};