const Discord = require('discord.js');

const addReactions = (message, reactions) => {
	message.react(reactions[0]);
	reactions.shift();
	if (reactions.length > 0) {
		setTimeout(() => addReactions(message, reactions), 750);
	}
};

const firstMessage = async (client, id, text, reactions = []) => {
	const channel = await client.channels.fetch(id);
	channel.messages.fetch().then((messages) => {
		if (messages.size === 0) {
			const embed = new Discord.MessageEmbed()
				.setTitle(':envelope: Support Ticket')
				.setDescription('Du hast eine Frage oder ein Problem über den Server die nicht in <#365763570371133451> geklärt wurden?\nUm ein Ticket zu erstellen reagiere mit :envelope: !')
				.setColor('#f77600')
				.setImage('https://media.discordapp.net/attachments/792499474609602561/811166605929218078/Hnet.com-image.gif');
			channel.send(embed).then((message) => {
				addReactions(message, reactions);
			});
		}
		else {
			for (const message of messages) {
				addReactions(message[1], reactions);
			}
		}
	});
};

module.exports = (client) => {
	const channelId = '365763570371133451';

	const getEmoji = (emojiName) =>
		client.emojis.cache.find((emoji) => emoji.name === emojiName);

	const emojis = {
		envelope: 'Envelope',
	};

	const reactions = [];

	let emojiText = 'Add a reaction to claim a role\n\n';
	for (const key in emojis) {
		const emoji = getEmoji(key);
		reactions.push(emoji);

		const role = emojis[key];
		emojiText += `${emoji} = ${role}\n`;
	}

	firstMessage(client, channelId, emojiText, reactions);

	const handleReaction = async (reaction, user, add, message) => {
		if (user.id === '772508572647030796') {
			return;
		}

		const emoji = reaction._emoji.name;

		const { guild } = reaction.message;

		const roleName = emojis[emoji];
		if (!roleName) {
			return;
		}

		const role = guild.roles.cache.find((role) => role.name === roleName);
		const member = guild.members.cache.find((member) => member.id === user.id);

		if (add) {
			const role = guild.roles.cache.find((role) => {
				return role.name === '@everyone';
			});

			const newChannel = await guild.channels.create(`${user.username}'s ticket`, {
				parent: '770778171280719902',
				permissionOverwrites: [
					{
						id: role.id,
						deny: ['VIEW_CHANNEL'],
					},
					{
						id: user.id,
						allow: ['VIEW_CHANNEL'],
					},
				],
			});

			const embed = new Discord.MessageEmbed()
				.setTitle(`Willkommen in deinem Ticket-Kanal, ${user.username}!`)
				.setDescription('Hier kannst du den Mods dein Problem schildern. Sie werden dir schnellstmöglich antworten.\n\nDu kannst das Ticket schließen indem du auf <:no:767394810909949983> reagierst.')
				.setColor('f77600');
			newChannel.send(`${user} <@&799397095337230387>`);
			const msgEmbed = await newChannel.send(embed);
			msgEmbed.react('<:no:767394810909949983>');

			client.on('messageReactionAdd', (reaction, user) => {
				if (reaction.message.channel.id === newChannel.id) {
					if (user.id === '772508572647030796') {
						return;
					}
					if (reaction._emoji.id === '767394810909949983') {
						newChannel.delete();
					}
				}
			});
		}
		else {
			return;
		}
	};

	client.on('messageReactionAdd', (reaction, user) => {
		if (reaction.message.channel.id === channelId) {
			handleReaction(reaction, user, true);
		}
	});

	client.on('messageReactionRemove', (reaction, user) => {
		if (reaction.message.channel.id === channelId) {
			handleReaction(reaction, user, false);
		}
	});
};
