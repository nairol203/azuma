// const Discord = require('discord.js');

const customsMain = require('../schemas/customs-main');
const customs = require('../schemas/customs');

const parentId = '810656492889440316';

module.exports = client => {
	client.on('voiceStateUpdate', async (oldState, newState) => {
		const { guild, member } = newState;

		const joined = !!newState.channelID;
		const channelId = joined ? newState.channelID : oldState.channelID;
		const channel = guild.channels.cache.get(channelId);

		const customsId = await customsMain.findOne({
			channelId,
		});

		if (customsId !== null) {
			const customsVoiceChannel = await guild.channels.create(`${member.user.username}'s Bereich`, {
				type: 'voice',
				parent: parentId,
			});
			/* const customsTextChannel = await guild.channels.create(`${member.user.username}'s-bereich`, {
				type: 'text',
				parent: parentId,
			});*/

			member.voice.setChannel(customsVoiceChannel);

			/* const embed = new Discord.MessageEmbed()
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
			customsTextChannel.send(embed);*/

			const channelId = customsVoiceChannel.id;

			const uploadVoiceChannel = await customs.insertMany(
				{
					channelId,
				},
			);
		}

		const customsId2 = await customs.findOne({
			channelId,
		});

		if (customsId2 !== null) {
			if (newState.channelID !== null) return;
			if (channel.members.size !== 0) return;
			channel.delete();
			const deleteChannel = await customs.findOneAndDelete({
				channelId,
			});
		}
	});
};