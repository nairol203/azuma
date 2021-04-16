const { no } = require('../emoji.json');
const { MessageEmbed } = require("discord.js");
const ytdl = require('ytdl-core');
const Util = require('discord.js');

const queue = new Map();

module.exports.serverQueue = (guildId) => {
	const serverQueue = queue.get(guildId);
	return serverQueue;
};

module.exports.handleVideo = async (video, client, interaction, voiceChannel, playList = false) => {
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
			return this.play(guild, queueConstruct.songs[0], userId);
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
		const l = serverQueue.songs.length - 1
		const embed = new MessageEmbed()
		.setTitle('Added To Queue')
		.setDescription(`[${serverQueue.songs[l].title}](${serverQueue.songs[l].url})`)
		.addFields(
			{ name: 'Requested by', value: `<@${userId}>`, inline: true },
			{ name: 'Länge', value: `\`${serverQueue.songs[l].duration}\``, inline: true },
			{ name: 'Queue', value: `${serverQueue.songs.length} songs - \`00:00:00\``, inline: true },
		)
		.setColor('#f77600');
		return embed;
	}
}

module.exports.play = (guild, song, userId) => {
	const serverQueue = queue.get(guild.id);

	if(!song) {
		serverQueue.voiceChannel.leave();
		queue.delete(guild.id);
		return;
	}
	const dispatcher = serverQueue.connection.play(ytdl(song.url))
		.on('finish', () => {
			if (!serverQueue.loop) serverQueue.songs.shift();
			this.play (guild, serverQueue.songs[0]);
		})
		.on('error', error => {
			console.log(error);
		});
	dispatcher.setVolumeLogarithmic(serverQueue.volume / 5);
	const embed = new MessageEmbed()
		.setTitle('Playing...')
		.setDescription(`[${serverQueue.songs[0].title}](${serverQueue.songs[0].url})`)
		.addFields(
			{ name: 'Requested by', value: '<@772508572647030796>', inline: true },
			{ name: 'Länge', value: `\`${serverQueue.songs[0].duration}\``, inline: true },
			{ name: 'Queue', value: `1 song - \`${serverQueue.songs[0].duration}\``, inline: true },
		)
		.setColor('#f77600');
	serverQueue.textChannel.send(embed);
}


module.exports.handleVideoOld = async (video, message, voiceChannel, playList = false) => {
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
			this.playOld(message.guild, queueConstruct.songs[0]);
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
		const l = serverQueue.songs.length - 1;
		const embed = new MessageEmbed()
			.setTitle('Added To Queue')
			.setDescription(`[${serverQueue.songs[l].title}](${serverQueue.songs[l].url})`)
			.addFields(
				{ name: 'Requested by', value: `<@${message.author.id}>`, inline: true },
				{ name: 'Länge', value: `\`${serverQueue.songs[l].duration}\``, inline: true },
				{ name: 'Queue', value: `${serverQueue.songs.length} songs - \`00:00:00\``, inline: true },
			)
			.setColor('#f77600');
		return message.channel.send(embed);
	}
	return undefined;
}

module.exports.playOld = (guild, song) => {
	const serverQueue = queue.get(guild.id);

	if(!song) {
		serverQueue.voiceChannel.leave();
		queue.delete(guild.id);
		return;
	}
	const dispatcher = serverQueue.connection.play(ytdl(song.url))
		.on('finish', () => {
			if (!serverQueue.loop) serverQueue.songs.shift();
			this.playOld (guild, serverQueue.songs[0]);
		})
		.on('error', error => {
			console.log(error);
		});
	dispatcher.setVolumeLogarithmic(serverQueue.volume / 5);
	const embed = new MessageEmbed()
		.setTitle('Playing...')
		.setDescription(`[${serverQueue.songs[0].title}](${serverQueue.songs[0].url})`)
		.addFields(
			{ name: 'Requested by', value: '<@772508572647030796>', inline: true },
			{ name: 'Länge', value: `\`${serverQueue.songs[0].duration}\``, inline: true },
			{ name: 'Queue', value: `1 song - \`${serverQueue.songs[0].duration}\``, inline: true },
		)
		.setColor('#f77600');
	serverQueue.textChannel.send(embed);
}

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