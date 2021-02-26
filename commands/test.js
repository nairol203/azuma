const YouTube = require('simple-youtube-api');
const youtube = new YouTube('AIzaSyB6QDXYXVDM-I7bwktzn6LOEn_71SubjHQ');
const music = require('./musik/play');

module.exports = {
	callback: async ({ message, args }) => {
		const voiceChannel = message.member.voice.channel;
		const searchString = args.slice(1).join(' ');
		const url = args[1] ? args[1].replace(/<(.+)>/g, '$1') : '';
		try {
			var video = await youtube.getVideoByID(url);
		}
		catch {
			try {
				const videos = await youtube.searchVideos(searchString, 1);
				var video = await youtube.getVideoByID(videos[0].id);
			}
			catch {
				return message.channel.send('<:no:767394810909949983> | Ich konnte keine passenden Suchergebnisse finden.');
			}
		}
		return music.handleVideo(video, message, voiceChannel);
	},
};