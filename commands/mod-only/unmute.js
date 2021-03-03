const muteSchema = require('../../models/mute-schema');

module.exports = {
	minArgs: 1,
	maxArgs: 1,
	expectedArgs: '<@user or userId>',
	requiredPermissions: ['ADMINISTRATOR'],
	callback: async ({ message, args }) => {
		const { guild } = message;

		let id = '';

		const target = message.mentions.users.first();
		if (target) {
			id = target.id;
		}
		else {
			id = args[0];
		}

		const result = await muteSchema.updateOne(
			{
				guildId: guild.id,
				userId: id,
				current: true,
			},
			{
				current: false,
			},
		);

		if (result.nModified === 1) {
			const mutedRole = guild.roles.cache.find((role) => {
				return role.name === 'Muted';
			});

			if (mutedRole) {
				const guildMember = guild.members.cache.get(id);
				guildMember.roles.remove(mutedRole);
			}

			message.reply(`du hast <@${id}> entmuted.`);
		}
		else {
			message.reply('dieser User ist akutell nicht gemuted.');
		}

	},
};