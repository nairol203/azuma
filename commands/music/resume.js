const { no } = require('../../emoji.json');
const { serverQueue } = require('../../features/music');

module.exports = {
	update: true,
	description: 'Setzt den pausierten Song fort',
	callback: ({ client, interaction }) => {
		const sQ = serverQueue(interaction.guild_id);
		const guild = client.guilds.cache.get(interaction.guild_id)
		const member = guild.members.cache.get(interaction.member.user.id);
		const voiceChannel = member.voice.channel;

		if(!voiceChannel) return [ no + ' Du musst in einem Sprachkanal sein um diesen Command zu benutzen!' ];
		if(!sQ) return [ no + ' Es wird gerade nichts gespielt' ];
		if(sQ.playing) return [ no + 'Die Musik ist nicht pausiert.' ];
		sQ.playing = true;
		sQ.connection.dispatcher.resume();
		return 'Die Musik wird weiter abgespielt.';
	},
};