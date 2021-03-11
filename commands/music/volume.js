const music = require('./play');

module.exports = {
	slash: true,
	callback: ({ client, interaction, args }) => {
		const serverQueue = music.serverQueue(interaction.guild_id);
		const number = args.number;
		const guild = client.guilds.cache.get(interaction.guild_id)
		const member = guild.members.cache.get(interaction.member.user.id);
		const voiceChannel = member.voice.channel;

		if(!voiceChannel) return '<:no:767394810909949983> | Du musst in einem Sprachkanal sein um diesen Command zu benutzen!';
		if(!serverQueue) return '<:no:767394810909949983> | Es wird gerade nichts gespielt';
		if(!number) return `Die Lautstärke des Bot's ist **${serverQueue.volume}**.`;

		if (number < 0) return 'Du kannst keine negative Lautstärke einstellen!';
		if (number > 5) return 'Wenn du dir die Ohren wegschallern willst hör lieber Metal!';

		serverQueue.connection.dispatcher.setVolumeLogarithmic(number / 5);
		return `Die Lautstärke wurde zu **${number}** geändert.`;
	},
};