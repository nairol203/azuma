const { MessageAttachment } = require('discord.js');
const { Rank } = require('canvacord');
const { getNeededXP } = require('../../events/levels');
const { findOne } = require('../../models/profile');

module.exports = {
	description: 'Zeigt dein aktuelles Level an',
	callback: async ({ client, interaction }) => {
		const guildId = interaction.guildID;
		const userId = interaction.member.user.id;
		const user = client.users.cache.get(userId);

		const user = await findOne({
			guildId,
			userId,
		});

		const needed = Math.round(getNeededXP(user.level - 1));
		const neededCurrent = Math.round(getNeededXP(user.level));
		const currendXp = user.xp - needed;
		const requiredXp = neededCurrent - needed;

		const rank = new Rank()
			.setAvatar(user.displayAvatarURL({ dynamic: false, format: 'png' }))
			.setCurrentXP(currendXp)
			.setDiscriminator(user.discriminator)
			.setLevel(user.level)
			.setProgressBar('#f77600')
			.setRank(1, 'test', false)
			.setRequiredXP(requiredXp)
			.setStatus(user.presence.status, false, false)
			.setUsername(user.username);
		await rank.build()
			.then(async data => {
				const attatchment = new MessageAttachment(data, 'levelcard.png');
				await interaction.reply({ files: [attatchment] });
			});
	},
};