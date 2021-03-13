const { no } = require('../../emoji.json');
const ytdl = require('ytdl-core');
const Util = require('discord.js');
const YouTube = require('simple-youtube-api');
const youtube = new YouTube('AIzaSyB6QDXYXVDM-I7bwktzn6LOEn_71SubjHQ');

const queue = new Map();

module.exports = {
	slash: true,
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
		const userId = interaction.member.user.id;
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

async function handleVideo(video, client, interaction, voiceChannel, playList = false) {
	const channel = client.channels.cache.get(interaction.channel_id);
	const guild = client.guilds.cache.get(interaction.guild_id);
	const serverQueue = queue.get(interaction.guild_id);
	const userId = interaction.member.user.id;

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
			textChannel: channel,
			voiceChannel: voiceChannel,
			connection: null,
			songs: [],
			volume: 1,
			playing: true,
			loop: false,
		};
		queue.set(interaction.guild_id, queueConstruct);
		queueConstruct.songs.push(song);

		try {
			const connection = await voiceChannel.join();
			queueConstruct.connection = connection;
			return play(guild, queueConstruct.songs[0], userId);
		}
		catch (error) {
			console.log(`Error occured while connection to the voice channel: ${error}`);
			queue.delete(interaction.guild_id);
			return  no + ` | ${error}`;
		}
	}
	else {
		serverQueue.songs.push(song);
		if(playList) return undefined;
		const embed = new Util.MessageEmbed()
		.setTitle('Added To Queue')
		.setDescription(`[${serverQueue.songs[0].title}](${serverQueue.songs[0].url})`)
		.addFields(
			{ name: 'Requested by', value: `<@${userId}>`, inline: true },
			{ name: 'Länge', value: `\`${serverQueue.songs[0].duration}\``, inline: true },
			{ name: 'Queue', value: `${serverQueue.songs.length} songs - \`00:00:00\``, inline: true },
		)
		.setColor('#f77600');
		return embed;
	}
}
function play(guild, song, userId) {
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
	const embed = new Util.MessageEmbed()
	.setTitle('Playing...')
	.setDescription(`[${serverQueue.songs[0].title}](${serverQueue.songs[0].url})`)
	.addFields(
		{ name: 'Requested by', value: `<@${userId}>`, inline: true },
		{ name: 'Länge', value: `\`${serverQueue.songs[0].duration}\``, inline: true },
		{ name: 'Queue', value: `1 song - \`${serverQueue.songs[0].duration}\``, inline: true },
	)
	.setColor('#f77600');
	return embed;
}
module.exports.handleVideo = handleVideo;
module.exports.serverQueue = (guildId) => {
	const serverQueue = queue.get(guildId);
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
