/* eslint-disable no-var */
const ytdl = require('ytdl-core');
const Util = require('discord.js');
const YouTube = require('simple-youtube-api');
const youtube = new YouTube('AIzaSyB6QDXYXVDM-I7bwktzn6LOEn_71SubjHQ');

const queue = new Map();

module.exports = {
	callback: async ({ message, args }) => {
		const searchString = args.join(' ');
		const url = args[1] ? args[1].replace(/<(.+)>/g, '$1') : '';

		const voiceChannel = message.member.voice.channel;
		if(!voiceChannel) return message.channel.send('<:no:767394810909949983> | Du musst in einem Sprachkanal sein um diesen Command zu benutzen!');
		const permissons = voiceChannel.permissionsFor(message.client.user);
		if(!permissons.has('CONNECT')) return message.channel.send('<:no:767394810909949983> | Ich habe keine Berechtigung deinem Sprachkanal beizutreten!');
		if(!permissons.has('SPEAK')) return message.channel.send('<:no:767394810909949983> | Ich kann in deinem Sprachkanal nicht sprechen!');

		if(url.match(/^https?:\/\/(www.youtube.com|youtube.com)\/playlist(.*)$/)) {
			const playList = await youtube.getPlaylist(url);
			const videos = await playList.getVideos();
			for (const video of Object.values(videos)) {
				const video2 = await youtube.getVideoByID(video.id);
				await handleVideo(video2, message, voiceChannel, true);
			}
			message.channel.send(`Playlist **${playList.title}** wurde zur Queue hinzugefügt.`);
			return undefined;
		}
		else {
			try {
				var video = await youtube.getVideoByID(url);
			}
			catch {
				try {
					const videos = await youtube.searchVideos(searchString, 1);
					// eslint-disable-next-line no-redeclare
					var video = await youtube.getVideoByID(videos[0].id);
				}
				catch {
					return message.channel.send('<:no:767394810909949983> | Ich konnte keine passenden Suchergebnisse finden.');
				}
			}
			return handleVideo(video, message, voiceChannel);
		}
	},
};

async function handleVideo(video, message, voiceChannel, playList = false) {
	const serverQueue = queue.get(message.guild.id);

	const song = {
		id: video.id,
		title: Util.escapeMarkdown(video.title),
		url: `https://www.youtube.com/watch?v=${video.id}`,
	};

	if(!serverQueue) {
		const queueConstruct = {
			textChannel: message.channel,
			voiceChannel: voiceChannel,
			connection: null,
			songs: [],
			volume: 2,
			playing: true,
			loop: false,
		};
		queue.set(message.guild.id, queueConstruct);
		queueConstruct.songs.push(song);

		try {
			const connection = await voiceChannel.join();
			queueConstruct.connection = connection;
			play(message.guild, queueConstruct.songs[0]);
		}
		catch (error) {
			console.log(`Error occured while connection to the voice channel: ${error}`);
			queue.delete(message.guild.id);
			return message.channel.send(`<:no:767394810909949983> | ${error}`);
		}
	}
	else {
		serverQueue.songs.push(song);
		if(playList) return undefined;
		return message.channel.send(`\`${song.title}\` wurde zur Queue hinzugefügt`);
	}
	return undefined;
}
function play(guild, song) {
	const serverQueue = queue.get(guild.id);

	if(!song) {
		serverQueue.voiceChannel.leave();
		queue.delete(guild.id);
		return;
	}
	const dispatcher = serverQueue.connection.play(ytdl(song.url))
		.on('finish', () => {
			if (!serverQueue.loop) serverQueue.songs.shift();
			play (guild, serverQueue.songs[0]);
		})
		.on('error', error => {
			console.log(error);
		});
	dispatcher.setVolumeLogarithmic(serverQueue.volume / 5);
	serverQueue.textChannel.send(`:notes: | \`${serverQueue.songs[0].title}\` wird gespielt...`);
}

module.exports.serverQueue = (message) => {
	const serverQueue = queue.get(message.guild.id);
	return serverQueue;
};

module.exports.handleVideo = handleVideo;