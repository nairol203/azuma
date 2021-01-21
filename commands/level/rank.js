const Discord = require('discord.js');
const Levels = require('discord-xp');
const Canvacord = require('canvacord');

module.exports = {
	minArgs: 0,
	maxArgs: 1,
	expectedArgs: '<@user>',
	callback: async ({ message }) => {
		const target = message.mentions.users.first() || message.author;
		const user = await Levels.fetch(target.id, message.guild.id);
		const neededXp = Levels.xpFor(parseInt(user.level) + 1);
		if (!user) return message.channel.send(`${target.tag} hat noch keine Erfahrung gesammelt.`);

		const rank = new Canvacord.Rank()
			.setAvatar(target.displayAvatarURL({ dynamic: false, format: 'png' }))
			.setCurrentXP(user.xp)
			.setDiscriminator(target.discriminator)
			.setLevel(user.level)
			.setProgressBar('#f77600')
			.setRank(1, 'test', false)
			.setRequiredXP(neededXp)
			.setStatus(target.presence.status, false, false)
			.setUsername(target.username);
		rank.build()
			.then(data => {
				const attatchment = new Discord.MessageAttachment(data, 'levelcard.png');
				message.channel.send(attatchment);
			});
	},
};