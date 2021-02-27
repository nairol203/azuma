const Discord = require('discord.js');
const Levels = require('../../features/levels');
const profileSchema = require('../../models/profile-schema');
const Canvacord = require('canvacord');

module.exports = {
	aliases: 'level',
	minArgs: 0,
	maxArgs: 1,
	expectedArgs: '<@user>',
	callback: async ({ message }) => {
		const target = message.mentions.users.first() || message.author;
		if (target.bot) return;
		const guildId = message.guild.id;
		const userId = target.id;
		const user = await profileSchema.findOne({
			guildId,
			userId,
		});

		const needed = Math.round(Levels.getNeededXP(user.level - 1));
		const neededCurrent = Math.round(Levels.getNeededXP(user.level));
		const currendXp = user.xp - needed;
		const requiredXp = neededCurrent - needed;

		const rank = new Canvacord.Rank()
			.setAvatar(target.displayAvatarURL({ dynamic: false, format: 'png' }))
			.setCurrentXP(currendXp)
			.setDiscriminator(target.discriminator)
			.setLevel(user.level)
			.setProgressBar('#f77600')
			.setRank(1, 'test', false)
			.setRequiredXP(requiredXp)
			.setStatus(target.presence.status, false, false)
			.setUsername(target.username);
		rank.build()
			.then(data => {
				const attatchment = new Discord.MessageAttachment(data, 'levelcard.png');
				message.channel.send(attatchment);
			});
	},
};