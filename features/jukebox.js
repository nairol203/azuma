const YouTube = require('simple-youtube-api');
const youtube = new YouTube('AIzaSyB6QDXYXVDM-I7bwktzn6LOEn_71SubjHQ');
const music = require('../commands/music/play');
const customs = require('../models/customs');

async function play(message, args, voiceChannel) {
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
}

module.exports = (client) => {
	client.on('messageReactionAdd', async (reaction, user) => {
		const { _emoji, message } = reaction;
		if (user.bot == true) return;
		const userId = user.id;
		const customsChannel = await customs.findOne({
			userId,
		});
		if (customsChannel == null) return;
		if (message.channel.id != customsChannel.textChannelId) return;
		const guild = client.guilds.cache.get('255741114273759232');
		const voiceChannel = guild.channels.cache.get(customsChannel.channelId);
		reaction.users.remove(user.id);
		if (_emoji.name == '1️⃣') {
			const args = [ 'NO', 'HUGS', 'Ufo361' ];
			play(message, args, voiceChannel);
		}
		if (_emoji.name == '2️⃣') {
			const args = [ '7', 'million', 'ways', 'Rass', 'Limit' ];
			play(message, args, voiceChannel);
		}
		if (_emoji.name == '3️⃣') {
			const args = [ 'Ohne', 'dich', 'KASIMIR' ];
			play(message, args, voiceChannel);
		}
		if (_emoji.name == '4️⃣') {
			const args = [ 'WINGS', 'Ufo361' ];
			play(message, args, voiceChannel);
		}
		if (_emoji.name == '5️⃣') {
			const args = [ 'Hilf', 'mir', 'Edo', 'Saiya' ];
			play(message, args, voiceChannel);
		}
	});
};