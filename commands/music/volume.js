const { no } = require('../../emoji.json');
const { serverQueue } = require('../../features/music');

module.exports = {
	slash: true,
	description: 'Stelle die Lautstärke des Bot \'s ein',
	options: [
		{
			name: 'lautstärke',
			description: 'Lautstärke von 0-5',
			type: 4,
		},
	],
	callback: ({ client, interaction, args }) => {
		const sQ = serverQueue(interaction.guild_id);
		const number = args.number;
		const guild = client.guilds.cache.get(interaction.guild_id)
		const member = guild.members.cache.get(interaction.member.user.id);
		const voiceChannel = member.voice.channel;

		if(!voiceChannel) return no + ' | Du musst in einem Sprachkanal sein um diesen Command zu benutzen!';
		if(!sQ) return no + ' | Es wird gerade nichts gespielt';
		if(!number) return `Die Lautstärke des Bot's ist **${sQ.volume}**.`;

		if (number < 0) return 'Du kannst keine negative Lautstärke einstellen!';
		if (number > 5) return 'Wenn du dir die Ohren wegschallern willst hör lieber Metal!';
		sQ.volume = number
		sQ.connection.dispatcher.setVolumeLogarithmic(number / 5);
		sQ.volume
		return `Die Lautstärke wurde zu **${number}** geändert.`;
	},
};