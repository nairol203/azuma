const Levels = require('discord-xp');

module.exports = {
	minArgs: 0,
	maxArgs: 1,
	expectedArgs: '<@user>',
	callback: async ({ message }) => {
		const target = message.mentions.users.first() || message.author;
		const user = await Levels.fetch(target.id, message.guild.id);
		const neededXp = Levels.xpFor(parseInt(user.level) + 1);
		if (!user) return message.channel.send(`${target.tag} hat noch keine Erfahrung gesammelt.`);
		message.channel.send(`**${target}** ist aktuell \`Level ${user.level}\` und braucht noch \`${neededXp - user.xp} XP\` für \`Level ${user.level + 1}\`!`);
	},
};