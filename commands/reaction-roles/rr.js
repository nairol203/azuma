const { fetchCache, addToCache } = require('../../features/rr');
const messageSchema = require('../../schemas/message');

module.exports = {
	minArgs: 3,
	expectedArgs: '<emoji> <role name, tag, or ID> <Role display name>',
	requiredPermission: ['ADMINISTRATOR'],
	callback: async ({ client, message, args }) => {
		const { guild } = message;

		if (!guild.me.hasPermission('MANAGE_ROLES')) {
			message.reply('Ich brauche die Berechtigung `MANAGE_ROLES` um diesen Befehl zu benutzen.');
			return;
		}

		let emoji = args.shift();
		let role = args.shift();
		const displayName = args.join(' ');

		if (role.startsWith('<@&')) {
			role = role.substring(3, role.length - 1);
			const channel1 = client.channels.cache.find(channel => channel.id === '781501076725563413');
			channel1.send(`${role} wurde als Reaction Role hinzugefügt.`);
		}

		const newRole =
      guild.roles.cache.find((r) => {
      // eslint-disable-next-line no-mixed-spaces-and-tabs
      	return r.name === role || r.id === role;
      }) || null;

		if (!newRole) {
			message.reply(`Ich konnte keine Rolle finden, die "${role}"heißt.`);
			return;
		}

		role = newRole;

		if (emoji.includes(':')) {
			const emojiName = emoji.split(':')[1];
			emoji = guild.emojis.cache.find((e) => {
				return e.name === emojiName;
			});
		}

		const [fetchedMessage] = fetchCache(guild.id);
		if (!fetchedMessage) {
			message.reply('An error occurred while running reaction roles command.');
			return;
		}

		const newLine = `${emoji} ${displayName}`;
		let { content } = fetchedMessage;

		if (content.includes(emoji)) {
			const split = content.split('\n');

			for (let a = 0; a < split.length; ++a) {
				if (split[a].includes(emoji)) {
					split[a] = newLine;
				}
			}

			content = split.join('\n');
		}
		else {
			content += `\n${newLine}`;
			fetchedMessage.react(emoji);
		}

		fetchedMessage.edit(content);

		const obj = {
			guildId: guild.id,
			channelId: fetchedMessage.channel.id,
			messageId: fetchedMessage.id,
		};

		await messageSchema.findOneAndUpdate(
			obj,
			{
				...obj,
				$addToSet: {
					roles: {
						emoji,
						roleId: role.id,
					},
				},
			},
			{
				upsert: true,
			},
		);

		addToCache(guild.id, fetchedMessage, emoji, role.id);
	},
};
