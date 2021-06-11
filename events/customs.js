const { MessageEmbed } = require('discord.js');
const { MessageButton, MessageActionRow} = require('discord-buttons');
const customs = require('../models/customs');

const parentId = '810764515582672917';
const mainChannelId = '810768943736160276';

module.exports = {
	name: 'voiceStateUpdate',
	async run(oldState, newState) {
		const { client, guild, member } = newState;

		const joined = !!newState.channelID;
		const channelId = joined ? newState.channelID : oldState.channelID;
		const channel = guild.channels.cache.get(channelId);

		const mainChannel = guild.channels.cache.get(mainChannelId);

		const userId = member.user.id;

		const searchChannel = await customs.findOne({
			userId,
		});

		const isNull = searchChannel;
		const channelName1 = isNull ? 'yes' : `${member.user.username}'s Zimmer`;

		function getChannelName(channelName) {
			if (channelName === `${member.user.username}'s Zimmer`) return channelName;

			const isUndefined = searchChannel.channelName;
			const channelName2 = isUndefined ? searchChannel.channelName : `${member.user.username}'s Zimmer`;
			return channelName2;
		}

		if (mainChannelId === newState.channelID) {
			mainChannel.updateOverwrite(member.user.id, { VIEW_CHANNEL: false });

			const userLimit = isNull ? searchChannel.channelLimit : 0;

			const customsVoiceChannel = await guild.channels.create(getChannelName(channelName1), {
				type: 'voice',
				parent: parentId,
				userLimit: userLimit,
				bitrate: 128000,
				permissionOverwrites: [
					{
						id: member.user.id,
						allow: 'CONNECT',
					},
					{
						id: '811192131019604008',
						allow: 'CONNECT',
					},
					{
						id: '255741114273759232',
						deny: 'CONNECT',
					},
				],
			});

			await member.voice.setChannel(customsVoiceChannel);

			const customsTextChannel = await guild.channels.create(`${member.user.username}'s-channel`, {
				type: 'text',
				parent: parentId,
				permissionOverwrites: [
					{
						id: member.user.id,
						allow: 'VIEW_CHANNEL',
					},
					{
						id: '811192131019604008',
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

			const button = new MessageButton()
				.setLabel('Kanal öffentlich machen')
				.setStyle('blurple')
				.setEmoji('🌎')
				.setID('unlock')

			const embed = new MessageEmbed()
				.setTitle(`Willkommen in deinem Zimmer, ${member.user.username}!`)
				.setDescription('Wir wünschen Ihnen einen angenehmen Aufenthalt. Der Zimmerservice kann Ihnen bei ein paar Dingen behilflich sein!')
				.addFields(
					{ name: 'Commands', value: '- Kanalnamen ändern: `/name`\n- User Zugriff auf den Kanal geben u. nehmen: `/permit` `/reject`\n- Kanallimit einstellen: `/limit`' },
				)
				.setColor('5865F2')
				.setFooter('Azuma | Contact florian#0002 for help', `https://cdn.discordapp.com/avatars/${client.user.id}/${client.user.avatar}.webp`);

			customsTextChannel.send({ embed: embed, buttons: [ button ] }).then((msg) => {
				msg.pin();
				const filter = (button) => button.clicker.user.id === message.author.id;
				const collector = m.createButtonCollector(filter);

				collector.on('collect', b => console.log(`Collected button with the id ${b.id}`));
				collector.on('end', collected => console.log(`Collected ${collected.size} items`));
			});


			// let args1 = '/';
			// let args2 = '/';
			// let args3 = '/';
			// let args4 = '/';
			// let args5 = '/';

			// if (searchChannel) {
			// 	args1 = searchChannel.args1;
			// 	if (!args1) args1 = '/';
			// 	args2 = searchChannel.args2;
			// 	if (!args2) args2 = '/';
			// 	args3 = searchChannel.args3;
			// 	if (!args3) args3 = '/';
			// 	args4 = searchChannel.args4;
			// 	if (!args4) args4 = '/';
			// 	args5 = searchChannel.args5;
			// 	if (!args5) args5 = '/';
			// }

			// let jukeboxId = '';
			// const jukeboxEmbed = new MessageEmbed()
			// 	.setTitle('Jukebox')
			// 	.setDescription('Du kannst dir deine Lieblingssong abspeichern\nund diese dann per Shortcut abspielen!')
			// 	.addFields(
			// 		{ name: 'Speichere Songs:', value: '`/save <number> <song>`', inline: true },
			// 		{ name: 'Lösche Songs:', value: '`/delete <number>`', inline: true },
			// 		{ name: 'Deine gespeicherten Songs:', value: `:one: ${args1}\n:two: ${args2}\n:three: ${args3}\n:four: ${args4}\n:five: ${args5}` },
			// 	)
			// 	.setFooter('Azuma | Contact florian#0002 for help', `https://cdn.discordapp.com/avatars/${client.user.id}/${client.user.avatar}.webp`)
			// 	.setColor('#f77600');
			// customsTextChannel.send(jukeboxEmbed);
			const userId = newState.id;
			const channelId = customsVoiceChannel.id;
			const textChannelId = customsTextChannel.id;

			await customs.findOneAndUpdate(
				{
					userId,
				},
				{
					userId,
					channelId,
					textChannelId,
					jukeboxId,
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
		if (!customsId) return;
		const textChannel = guild.channels.cache.get(customsId.textChannelId);

		if (newState.channelID) {
			textChannel.updateOverwrite(newState.id, { VIEW_CHANNEL: true });
			mainChannel.updateOverwrite(newState.id, { VIEW_CHANNEL: false });
		}
		else if (!newState.channelID) {
			textChannel.updateOverwrite(newState.id, { VIEW_CHANNEL: false });
			mainChannel.updateOverwrite(newState.id, { VIEW_CHANNEL: true });
		}

		if (customsId) {
			if (newState.channelID) return;
			if (channel.members.size !== 0) return;
			channel.delete();
			textChannel.delete();
			mainChannel.updateOverwrite(member.user.id, { VIEW_CHANNEL: true });
		}
	},
};