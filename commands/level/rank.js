const Levels = require('../../events/levels');
const profileSchema = require('../../models/profile');
const Canvacord = require('canvacord');
// const { MessageAttachment } = require('discord.js');

module.exports = {
	slash: true,
	description: 'Zeigt dein aktuelles Level an',
	callback: async ({ client, args, interaction }) => {
		const guildId = interaction.guild_id;
		const targetId = args.user;
		const target = client.users.cache.get(targetId) || client.users.cache.get(interaction.member.user.id);
		if (target.bot) return 'Bot\'s haben kein Level!';
		const userId = target.id;

		const user = await profileSchema.findOne({
			guildId,
			userId,
		});

		// const needed = Math.round(Levels.getNeededXP(user.level - 1));
		// const neededCurrent = Math.round(Levels.getNeededXP(user.level));
		// const currendXp = user.xp - needed;
		// const requiredXp = neededCurrent - needed;

		// const rank = new Canvacord.Rank()
		// 	.setAvatar(target.displayAvatarURL({ dynamic: false, format: 'png' }))
		// 	.setCurrentXP(currendXp)
		// 	.setDiscriminator(target.discriminator)
		// 	.setLevel(user.level)
		// 	.setProgressBar('#f77600')
		// 	.setRank(1, 'test', false)
		// 	.setRequiredXP(requiredXp)
		// 	.setStatus(target.presence.status, false, false)
		// 	.setUsername(target.username);
		// await rank.build()
		// 	.then(data => {
		// 		const attatchment = new MessageAttachment(data, 'levelcard.png');
		// 		return attatchment
		// 	});
		
		return `${target} ist aktuell Level ${user.level}!`
	},
};