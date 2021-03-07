const muteSchema = require('../../../models/mute-schema');

const reasons = {
	SPAMMING: 5,
	ADVERTISING: 24,
};

module.exports = {
	minArgs: 2,
	maxArgs: 2,
	expectedArgs: '<@user> <reason>',
	callback : async ({ message, args }) => {
		const { guild, author: staff } = message;

		const target = message.mentions.users.first();
		if (!target) {
			message.reply('Erwähne jemanden den du bannen willst! `!ban <@user> <reason>`');
			return;
		}

		const reason = args[1].toUpperCase();
		if (!reasons[reason]) {
			let validReasons = '';
			for (const key in reasons) {
				validReasons += `${key}, `;
			}
			validReasons = validReasons.substr(0, validReasons.length - 2);

			message.reply(
				`bitte gebe einen Grund ein: ${validReasons}`,
			);
			return;
		}

		const previousMutes = await muteSchema.find({
			userId: target.id,
		});

		const currentlyMuted = previousMutes.filter((mute) => {
			return mute.current === true;
		});

		if (currentlyMuted.length) {
			message.reply('dieser User ist akutell schon gemuted.');
			return;
		}

		const duration = reasons[reason] * (previousMutes.length + 1);

		const expires = new Date();
		expires.setHours(expires.getHours() + duration);

		const mutedRole = guild.roles.cache.find((role) => {
			return role.name === 'Muted';
		});
		if (!mutedRole) {
			message.reply('ich konnte keine "Muted" Rolle finden.');
			return;
		}

		const targetMember = (await guild.members.fetch()).get(target.id);
		targetMember.roles.add(mutedRole);

		await new muteSchema({
			userId: target.id,
			guildId: guild.id,
			reason,
			staffId: staff.id,
			staffTag: staff.tag,
			expires,
			current: true,
		}).save();

		message.reply(
			`du hast <@${target.id}> für "${reason}" gemuted. Er/Sie wird in ${duration} Stunden entmuted.`,
		);
	},
};
