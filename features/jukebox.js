const YouTube = require('simple-youtube-api');
const youtube = new YouTube('AIzaSyB6QDXYXVDM-I7bwktzn6LOEn_71SubjHQ');
const music = require('../commands/music/play');
const customs = require('../models/customs');

async function play(message, args, voiceChannel) {
	const searchString = args;
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
}

module.exports = (client) => {
	client.on('messageReactionAdd', async (reaction, user) => {
		const { _emoji, message } = reaction;
		if (user.bot == true) return;
		const textChannelId = message.channel.id;
		const data = await customs.findOne({ textChannelId });
		if (!data) return;
		if (message.channel.id != data.textChannelId) return;
		const guild = client.guilds.cache.get('255741114273759232');
		const voiceChannel = guild.channels.cache.get(data.channelId);
		if (_emoji.name == '1️⃣') {
			reaction.users.remove(user.id);
			const args = await data.args1;
			if (!args) return;
			play(message, args, voiceChannel);
		}
		if (_emoji.name == '2️⃣') {
			reaction.users.remove(user.id);
			const args = await data.args2;
			if (!args) return;
			play(message, args, voiceChannel);
		}
		if (_emoji.name == '3️⃣') {
			reaction.users.remove(user.id);
			const args = await data.args3;
			if (!args) return;
			play(message, args, voiceChannel);
		}
		if (_emoji.name == '4️⃣') {
			reaction.users.remove(user.id);
			const args = await data.args4;
			if (!args) return;
			play(message, args, voiceChannel);
		}
		if (_emoji.name == '5️⃣') {
			reaction.users.remove(user.id);
			const args = await data.args5;
			if (!args) return;
			play(message, args, voiceChannel);
		}
		else {
			return;
		}
	});
};