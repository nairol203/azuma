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
		const embed = new Discord.MessageEmbed()
			.setTitle(':clipboard: Rollenverteilung')
			.setDescription('```Füge eine Reaktion hinzu oder entferne eine, je nach dem welche Rolle du haben willst (●\'◡\'●)```\n<:EpicGames:782650903156621382> **Free Epic Games** - Bekomme immer eine Benachrichtigung wenn ein Spiel im Epic Store gratis ist!\n\n:bell: **Server-News** - Bekomme immer eine Benachrichtigung wenn ein Update von diesem Server gepostet wird!')
			.setColor('#f77600')
			.setFooter('Letztes Update')
			.setTimestamp('2021-02-16T13:31:00.000Z');
		if (messages.size === 0) {
			channel.send(embed).then((message) => {
				addReactions(message, reactions);
			});
		}
		else {
			for (const message of messages) {
				message[1].edit(embed);
				addReactions(message[1], reactions);
			}
		}
	});
};

module.exports = (client) => {
	const channelId = '782595813196038175';

	const getEmoji = (emojiName) =>
		client.emojis.cache.find((emoji) => emoji.name === emojiName);

	const emojis = {
		EpicGames: 'Free Games',
		bell: 'Server-News',
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
			member.roles.add(role);
		}
		else {
			member.roles.remove(role);
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
