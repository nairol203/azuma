const ytdl = require('ytdl-core');
const Util = require('discord.js');
const YouTube = require('simple-youtube-api');
const youtube = new YouTube('AIzaSyB6QDXYXVDM-I7bwktzn6LOEn_71SubjHQ');

const queue = new Map();

module.exports = {
	callback: async ({ message, args }) => {
		const searchString = args.slice(1).join(' ');
		const url = args[0] ? args[0].replace(/<(.+)>/g, '$1') : '';
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

	const duration = toSecond(Number(video.durationSeconds));
	const isLive = video.durationSeconds === 0;
	const formattedDuration = isLive ? 'Live' : formatDuration(duration * 1000);

	const song = {
		id: video.id,
		title: Util.escapeMarkdown(video.title),
		duration: formattedDuration,
		url: `https://www.youtube.com/watch?v=${video.id}`,
	};

	if(!serverQueue) {
		const queueConstruct = {
			textChannel: message.channel,
			voiceChannel: voiceChannel,
			connection: null,
			songs: [],
			volume: 1,
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
		return message.channel.send(`\`${song.title}\` - \`${song.duration}\` wurde zur Queue hinzugefügt`);
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
	serverQueue.textChannel.send(`:notes: | \`${serverQueue.songs[0].title}\` - \`${serverQueue.songs[0].duration}\` wird gespielt...`);
}
module.exports.handleVideo = handleVideo;
module.exports.serverQueue = (message) => {
	const serverQueue = queue.get(message.guild.id);
	return serverQueue;
};

const formatInt = int => {
	if (int < 10) return `0${int}`;
	return `${int}`;
};

function formatDuration(milliseconds) {
	if (!milliseconds || !parseInt(milliseconds)) return '00:00';
	const seconds = Math.floor(milliseconds % 60000 / 1000);
	const minutes = Math.floor(milliseconds % 3600000 / 60000);
	const hours = Math.floor(milliseconds / 3600000);
	if (hours > 0) {
		return `${formatInt(hours)}:${formatInt(minutes)}:${formatInt(seconds)}`;
	}
	if (minutes > 0) {
		return `${formatInt(minutes)}:${formatInt(seconds)}`;
	}
	return `00:${formatInt(seconds)}`;
}

function toSecond(string) {
	if (!string) return 0;
	if (typeof string !== 'string') return parseInt(string);
	let h = 0,
		m = 0,
		s = 0;
	if (string.match(/:/g)) {
		const time = string.split(':');
		if (time.length === 2) {
			m = parseInt(time[0], 10);
			s = parseInt(time[1], 10);
		}
		else if (time.length === 3) {
			h = parseInt(time[0], 10);
			m = parseInt(time[1], 10);
			s = parseInt(time[2], 10);
		}
	}
	else {s = parseInt(string, 10);}
	return h * 60 * 60 + m * 60 + s;
}
