module.exports = {
	callback: ({ client, message }) => {
		const queue = client.distube.getQueue(message);
		message.channel.send('Song Queue:\n' + queue.songs.map((song, id) =>
			`**${id + 1}**. ${song.name} - \`${song.formattedDuration}\``,
		).slice(0, 10).join('\n'));
	},
};