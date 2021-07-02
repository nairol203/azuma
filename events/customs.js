const { MessageEmbed, MessageButton, MessageActionRow } = require('discord.js');
const wait = require('util').promisify(setTimeout);
const customs = require('../models/customs');

const parentId = '810764515582672917';
const mainChannelId = '853573910163488798';

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
			});
			customsVoiceChannel.updateOverwrite(member.user.id, { CONNECT: true });
			customsVoiceChannel.updateOverwrite('255741114273759232', { CONNECT: false});

			await member.voice.setChannel(customsVoiceChannel);

			const customsTextChannel = await guild.channels.create(`${member.user.username}'s-channel`, {
				type: 'text',
				parent: parentId,
			});

			customsTextChannel.updateOverwrite(member.user.id, { VIEW_CHANNEL: true });
			customsTextChannel.updateOverwrite('255741114273759232', { VIEW_CHANNEL: false});

			guild.members.cache.get(member.user.id).roles.add('853257628934733834')

			const row = new MessageActionRow()
				.addComponents(
					new MessageButton()
						.setLabel('Kanal öffentlich machen')
						.setStyle('PRIMARY')
						.setEmoji('🌎')
						.setCustomID('unlock'),
				);

			const row1 = new MessageActionRow()
				.addComponents(
					new MessageButton()
						.setLabel('Kanal privat stellen')
						.setStyle('PRIMARY')
						.setEmoji('🔒')
						.setCustomID('lock'),
				);

			const embed = new MessageEmbed()
				.setTitle(`Willkommen in deinem Zimmer, ${member.user.username}!`)
				.setDescription('Wir wünschen Ihnen einen angenehmen Aufenthalt. Der Zimmerservice kann Ihnen bei ein paar Dingen behilflich sein!')
				.addFields(
					{ name: 'Commands', value: '- Kanalnamen ändern: `/name`\n- User Zugriff auf den Kanal geben u. nehmen: `/permit` `/reject`\n- Kanallimit einstellen: `/limit`' },
				)
				.setColor('5865F2')
				.setFooter('Azuma | Contact florian#0002 for help', `https://cdn.discordapp.com/avatars/${client.user.id}/${client.user.avatar}.webp`);

			customsTextChannel.send({ embeds: [embed], components: [ row1 ] }).then((msg) => {
				msg.pin();
				const filter = i => i.user.id === userId;
				const collector = msg.createMessageComponentInteractionCollector({ filter });
				collector.on('collect', async button => {
					if (button.customID == 'unlock') {
						customsVoiceChannel.updateOverwrite('255741114273759232', { CONNECT: true});
						await button.update({ embeds: [embed], components: [ row ] });
					}
					else if (button.customID == 'lock') {
						customsVoiceChannel.updateOverwrite(userId, { CONNECT: true });
						customsVoiceChannel.updateOverwrite('255741114273759232', { CONNECT: false});
						await button.update({ embeds: [embed], components: [ row1 ] });
					};
				});
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
					// jukeboxId,
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

		deleteChannel()

		async function deleteChannel() {
			// if (!customsId) return;
			// if (newState.channelID) return;
			if (channel.members.size !== 0) return;
			await wait(10000);
			if (channel.members.size !== 0) return;
			channel.delete();
			textChannel.delete();
			mainChannel.updateOverwrite(member.user.id, { VIEW_CHANNEL: true });
			guild.members.cache.get(member.user.id).roles.remove('853257628934733834')
		}
	},
};