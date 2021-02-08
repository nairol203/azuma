const cooldowns = new Set();
const Discord = require('discord.js');
const database = require('../../features/textchannel');
const textChannelSchema = require('../../schemas/textchannel-schema');

module.exports = {
	ownwerOnly: true,
	callback: async ({ message, args }) => {
		const guildId = message.guild.id;
		const userId = message.author.id;
		const { channel } = message;

		if(args[0] === 'create') {
			const result = await textChannelSchema.findOne({
				guildId,
				userId,
			});
			if(result !== null) return message.reply('Du hast bereits einen eigenen Kanal.');
			if (cooldowns.has(message.author.id)) return channel.send('Du kannst diesen Befehl nur alle 10 Minuten benutzen!');
			cooldowns.add(message.author.id);
			setTimeout(() => cooldowns.delete(message.author.id), 600 * 1000);

			const newChannel = await message.guild.channels.create(`${message.author.username}'s channel`, {
				parent: '808409088886046720',
				permissionOverwrites: [
					{
						id: message.author.id,
						allow: 'VIEW_CHANNEL',
					},
					{
						id: '255741114273759232',
						deny: 'VIEW_CHANNEL',
					},
					{
						id: '770785336829018164',
						deny: 'VIEW_CHANNEL',
					},
					{
						id: '707606601225207868',
						deny: 'VIEW_CHANNEL',
					},
					{
						id: '799794205902766081',
						deny: 'SEND_MESSAGES',
					},
				],
			});
			const embed = new Discord.MessageEmbed()
				.setTitle(`Willkommen in deinem eigenen Textkanal, ${message.author.username}!`)
				.setDescription('Du kannst mit diesen Befehlen deinen Kanal anpassen:')
				.addFields(
					{ name: 'Alle User freischalten:', value: '`!text unlock`', inline: true },
					{ name: 'Alle User sperren:', value: '`!text lock`', inline: true },
					{ name: 'Den Namen ändern:', value: '`!text name <name>`', inline: false },
					{ name: 'Einen User freischalten:', value: '`!text permit <userId>`', inline: true },
					{ name: 'Einen User sperren:', value: '`!text reject <userId>`', inline: true },
				)
				.setColor('#f77600')
				.setFooter('Administratoren und manche Bots haben immer Zugriff auf deinen Kanal.');
			newChannel.send(embed).then((msg) => msg.pin());
			const channelId = newChannel.id;
			// eslint-disable-next-line no-unused-vars
			const uploadData = database.addChannel(guildId, userId, channelId);
			return;
		}
		const channelId = channel.id;
		const result = await textChannelSchema.findOne({
			guildId,
			userId,
			channelId,
		});

		if(result === null) {return message.reply('du bist nicht der Owner dieses Kanals.');}
		else if(args[0] === 'name') {
			if(result === null) return message.reply('du bist nicht der Owner dieses Kanals.');
			if(!args[1]) return message.reply('versuche es so: `!text name <name>`');
			channel.setName(args[1]);
			message.channel.send(`Der Name des Kanals wurde auf ${args[1]} geändert.`);
		}
		else if(args[0] === 'lock') {
			channel.updateOverwrite(message.author, { VIEW_CHANNEL: true });
			channel.updateOverwrite('255741114273759232', { VIEW_CHANNEL: false });
			message.channel.send('Der Kanal wurde abgeschlossen und nur noch die User, denen du Rechte gegeben hast, können auf diesen Kanal zugreifen.');
		}
		else if(args[0] === 'unlock') {
			channel.updateOverwrite('255741114273759232', { VIEW_CHANNEL: true });
			message.channel.send('Alle User können jetzt auf diesen Kanal zugreifen.');
		}
		else if(args[0] === 'permit') {
			if(!args[1]) return message.reply('versuche es so: `!text permit <userId>`');
			channel.updateOverwrite(args[1], { VIEW_CHANNEL: true });
			message.channel.send(`Du hast <@${args[1]}> Zugriff auf diesen Kanal gegeben.`);

		}
		else if(args[0] === 'reject') {
			if(!args[1]) return message.reply('versuche es so: `!text reject <userId>`');
			channel.updateOverwrite(args[1], { VIEW_CHANNEL: false });
			message.channel.send(`Du hast <@${args[1]}> Zugriff auf diesen Kanal verweigert.`);

		}
		else if(args[0] === 'delete') {
			channel.setParent('692533397796421662');
			channel.updateOverwrite(message.author, { VIEW_CHANNEL: true });
			message.reply('du hast diesen Kanal ins Archiv verschoben. Wenn du ihn endgültig löschen willst, muss ein Administrator das für dich tun.');
		}
	},
};