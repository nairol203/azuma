module.exports = {
	name: 'guildMemberRemove',
	run(member, client) {
		const autoLogs = client.channels.cache.find(channel => channel.id === '781501076725563413');
		if (member.guild.id === '255741114273759232') {
			autoLogs.send(`📤 ${member.user} hat den Server verlassen.`);
			return;
		}
	},
};