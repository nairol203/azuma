const Discord = require('discord.js');
const Levels = require('../../features/levels');
const profileSchema = require('../../schemas/profile-schema');
const Canvacord = require('canvacord');

module.exports = {
	aliases: 'level',
	minArgs: 0,
	maxArgs: 1,
	expectedArgs: '<@user>',
	callback: async ({ message }) => {
		const target = message.mentions.users.first() || message.author;
		const guildId = message.guild.id;
		const userId = message.author.id;
		const user = await profileSchema.findOne({
			guildId,
			userId,
		});

		const xp1 = Levels.getNeededXP(user.level) - user.xp;
		const xp2 = Levels.getNeededXP(user.level) - Levels.getNeededXP(user.level - 1);

		console.log(user.xp, user.level, Levels.getNeededXP(user.level));

		console.log(xp1, xp2);
		const rank = new Canvacord.Rank()
			.setAvatar(target.displayAvatarURL({ dynamic: false, format: 'png' }))
			.setCurrentXP(xp1)
			.setDiscriminator(target.discriminator)
			.setLevel(user.level)
			.setProgressBar('#f77600')
			.setRank(1, 'test', false)
			.setRequiredXP(xp2)
			.setStatus(target.presence.status, false, false)
			.setUsername(target.username);
		rank.build()
			.then(data => {
				const attatchment = new Discord.MessageAttachment(data, 'levelcard.png');
				message.channel.send(attatchment);
			});
	},
};