const Discord = require('discord.js');

const customsMain = require('../schemas/customs-main');
const customs = require('../schemas/customs');

const parentId = '810764515582672917';

module.exports = client => {
	client.on('voiceStateUpdate', async (oldState, newState) => {
		const { guild, member } = newState;

		const joined = !!newState.channelID;
		const channelId = joined ? newState.channelID : oldState.channelID;
		const channel = guild.channels.cache.get(channelId);

		const customsMainId = await customsMain.findOne({
			channelId,
		});

		const userId = member.user.id;
		const searchChannel = await customs.findOne({
			userId,
		});
		if (customsMainId !== null) {
			const customsVoiceChannel = await guild.channels.create(`${member.user.username}'s Bereich`, {
				type: 'voice',
				parent: parentId,
			});

			await member.voice.setChannel(customsVoiceChannel);

			if (searchChannel !== null) {
				await customsVoiceChannel.setName(searchChannel.channelName);
				await customsVoiceChannel.setUserLimit(searchChannel.channelLimit);
			}

			const customsTextChannel = await guild.channels.create(`${member.user.username}'s-bereich`, {
				type: 'text',
				parent: parentId,
				permissionOverwrites: [
					{
						id: member.user.id,
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
				.setTitle(`Willkommen in deinem eigenen Sprachkanal, ${member.user.username}!`)
				.setDescription('Du kannst mit diesen Befehlen deinen Kanal anpassen:')
				.addFields(
					{ name: 'Abschließen:', value: '`!voice lock`', inline: true },
					{ name: 'Aufschließen:', value: '`!voice unlock`', inline: true },
					{ name: 'Den Namen ändern:', value: '`!voice name <name>`', inline: true },
					{ name: 'Für bestimmte Personen abschließen:', value: '`!text reject <@user>`', inline: false },
					{ name: 'Für bestimmte Personen aufschließen:', value: '`!text permit <@user>`', inline: false },
					{ name: 'Die Zimmergröße beschränken:', value: '`!voice limit <number>`', inline: false },
				)
				.setColor('#b8ff00')
				.setFooter('Info: Administratoren und manche Bots haben immer Zugriff auf deinen Kanal.');
			customsTextChannel.send(embed);

			const userId = newState.id;
			const channelId = customsVoiceChannel.id;
			const textChannelId = customsTextChannel.id;

			const findVoiceChannel = await customs.findOne(
				{
					userId,
				},
			);
			const uploadVoiceChannel = await customs.findOneAndUpdate(
				{
					userId,
				},
				{
					userId,
					channelId,
					textChannelId,
				},
				{
					upsert: true,
					new: true,
				},
			);
		}

		const customsId = await customs.findOne({
			channelId,
		});
		if (customsId === null) return;
		const textChannel = guild.channels.cache.get(customsId.textChannelId);

		if (newState.channelID !== null) {
			textChannel.updateOverwrite(newState.id, { VIEW_CHANNEL: true });
		}
		else if (newState.channelID === null) {
			textChannel.updateOverwrite(newState.id, { VIEW_CHANNEL: false });
		}

		if (customsId !== null) {
			if (newState.channelID !== null) return;
			if (channel.members.size !== 0) return;
			channel.delete();
			textChannel.delete();

		}
	});
};