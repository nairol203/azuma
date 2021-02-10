module.exports = (client) => {
	const autoLogs = client.channels.cache.find(channel => channel.id === '781501076725563413');

	client.on('guildMemberAdd', member => {
		if (member.guild.id === '255741114273759232') {
			member.roles.add('770782137338036265');
			member.send(`Wilkommen auf **${member.guild.name}**! Falls du Hilfe brauchst schau in <#786936121774702603> <:peepoHug:750428178979225640>`);

		}
		else if (member.guild.id === '506518638564737025') {
			member.roles.add('795453805789446144');
		}
		autoLogs.send(`📥 ${member.user} ist dem Server beigetreten.`);
	});

	client.on('guildMemberRemove', member => {
		autoLogs.send(`📤 ${member.user} hat den Server verlassen.`);
	});
};

module.exports.config = {
	displayName: 'Welcome',
	dbName: 'WELCOME',
};