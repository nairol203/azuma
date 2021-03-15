module.exports = {
	name: 'guildMemberAdd',
	run(member, client) {
		const autoLogs = client.channels.cache.find(channel => channel.id === '781501076725563413');
		const memberRole = member.guild.roles.cache.find(role => role.name === 'Member');
		const botRole = member.guild.roles.cache.find(role => role.name === 'Dev Bot');

		if (member.user.bot) {
			member.roles.add(botRole);
			return;
		}
		if (member.guild.id === '255741114273759232') {
			member.roles.add(memberRole);
			member.send(`Wilkommen auf **${member.guild.name}**! Falls du Hilfe brauchst schau in <#786936121774702603> <:peepoHug:750428178979225640>`);
			autoLogs.send(`📥 ${member.user} ist dem Server beigetreten.`);
			return;
		}
		else {
			member.roles.add(memberRole);
			return;
		}
	},
};