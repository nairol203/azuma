const { MessageAttachment } = require('discord.js');
const { Rank } = require('canvacord');
const { getNeededXP } = require('../../events/levels');
const profile = require('../../models/profile');

module.exports = {
	description: 'Zeigt dein aktuelles Level an',
	callback: async ({ client, interaction }) => {
		const target = client.users.cache.get(interaction.member.user.id)
		const userId = target.id;

		const user = await profile.findOne({ userId });

		const needed = Math.round(getNeededXP(user.level - 1));
		const neededCurrent = Math.round(getNeededXP(user.level));
		const currendXp = user.xp - needed;
		const requiredXp = neededCurrent - needed;

		const rank = new Rank()
			.setAvatar(target.displayAvatarURL({ dynamic: false, format: 'png' }))
			.setCurrentXP(currendXp)
			.setDiscriminator(target.discriminator)
			.setLevel(user.level)
			.setProgressBar('#f77600')
			.setRank(1, 'test', false)
			.setRequiredXP(requiredXp)
			.setStatus(target.presence.status, false, false)
			.setUsername(target.username);
		await rank.build()
			.then(async data => {
				const attatchment = new MessageAttachment(data, 'levelcard.png');
				await interaction.reply({ files: [attatchment],  });
			});
	},
};