const Discord = require('discord.js');
const textChannelSchema = require('../../schemas/textchannel-schema');

const cooldowns = new Set();

module.exports = {
	callback: async ({ client, message, args }) => {
		const { author, channel, guild } = message;
		const guildId = guild.id;
		const userId = author.id;
		const autoLogs = client.channels.cache.find(channel => channel.id === '781501076725563413');

		if (guild.id !== '255741114273759232') return;

		if(args[0] === 'create') {
			if (cooldowns.has(author.id)) return channel.send('Du kannst diesen Befehl nur alle 10 Minuten benutzen!');
			cooldowns.add(author.id);
			setTimeout(() => cooldowns.delete(author.id), 600 * 1000);

			const newChannel = await guild.channels.create(`${author.username}'s channel`, {
				parent: '808409088886046720',
				permissionOverwrites: [
					{
						id: author.id,
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
				.setTitle(`Willkommen in deinem eigenen Textkanal, ${author.username}!`)
				.setDescription('Du kannst mit diesen Befehlen deinen Kanal anpassen:')
				.addFields(
					{ name: 'Alle User freischalten:', value: '`!text unlock`', inline: true },
					{ name: 'Alle User sperren:', value: '`!text lock`', inline: true },
					{ name: 'Den Namen ändern:', value: '`!text name <name>`', inline: false },
					{ name: 'Einen User freischalten:', value: '`!text permit <userId>`', inline: true },
					{ name: 'Einen User sperren:', value: '`!text reject <userId>`', inline: true },
					{ name: 'Den Kanal archivieren:', value: '`!text archive`', inline: false },
					{ name: 'Den Kanal löschen:', value: '`!text delete`', inline: false },
				)
				.setColor('#f77600')
				.setFooter('Info: Administratoren und manche Bots haben immer Zugriff auf deinen Kanal.');
			newChannel.send(embed).then((msg) => msg.pin());
			message.reply(`dein Kanal wurde erstellt -> <#${newChannel.id}>`);
			autoLogs.send(`${author} hat ${newChannel} erstellt.`);
			const channelId = newChannel.id;
			const result = await textChannelSchema.insertMany(
				{
					guildId,
					userId,
					channelId,
				},
			);
			return;
		}
		const channelId = channel.id;
		const result = await textChannelSchema.findOne({
			guildId,
			userId,
			channelId,
		});

		if(result === null) {
			return message.reply('du bist nicht der Owner dieses Kanals.');
		}

		else if(args[0] === 'name') {
			if(!args[1]) return message.reply('versuche es so: `!text name <name>`');
			channel.setName(args[1]);
			channel.send(`Der Name des Kanals wurde geändert. Neuer Name: \`${args[1]}\`.`);
		}
		else if(args[0] === 'lock') {
			channel.updateOverwrite(author, { VIEW_CHANNEL: true });
			channel.updateOverwrite('255741114273759232', { VIEW_CHANNEL: false });
			channel.send('Nur noch die User, denen du Rechte gegeben hast, können auf diesen Kanal zugreifen.');
		}
		else if(args[0] === 'unlock') {
			channel.updateOverwrite('255741114273759232', { VIEW_CHANNEL: true });
			channel.send('Alle User können jetzt auf diesen Kanal zugreifen.');
		}
		else if(args[0] === 'permit') {
			if(!args[1]) return message.reply('versuche es so: `!text permit <userId>`');
			const mention = args[1].toString().replace('<@!', '');
			const mentionId = mention.toString().replace('>', '');
			channel.updateOverwrite(mentionId, { VIEW_CHANNEL: true });
			channel.send(`Du hast <@${mentionId}> Zugriff auf diesen Kanal gegeben.`);
		}
		else if(args[0] === 'reject') {
			if(!args[1]) return message.reply('versuche es so: `!text reject <userId>`');
			const mention = args[1].toString().replace('<@!', '');
			const mentionId = mention.toString().replace('>', '');
			channel.updateOverwrite(mentionId, { VIEW_CHANNEL: false });
			channel.send(`Du hast <@${mentionId}> den Zugriff auf diesen Kanal verweigert.`);
		}
		else if(args[0] === 'archive') {
			channel.setParent('692533397796421662', { lockPermissions: false });
			channel.updateOverwrite(author, { VIEW_CHANNEL: true });
			channel.updateOverwrite('255741114273759232', { VIEW_CHANNEL: false });
			message.reply('der Kanal wurde in das Archiv verschoben.');
		}
		else if(args[0] === 'delete') {
			const result = await textChannelSchema.findOneAndDelete({
				guildId,
				userId,
				channelId,
			});
			channel.delete();
			autoLogs.send(`${author} hat <#${channelId}> (ID: ${channelId}) gelöscht.`);
		}
	},
};