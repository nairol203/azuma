const muteSchema = require('../../../schemas/mute-schema');

module.exports = {
	minArgs: 1,
	maxArgs: 1,
	expectedArgs: '<@user or userId>',
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

			message.reply(`You unmuted <@${id}>`);
		}
		else {
			message.reply('That user is not muted');
		}

	},
};