const Discord = require('discord.js');

const customs = require('../schemas/customs');

const parentId = '810764515582672917';
const mainChannelId = '810768943736160276';

module.exports = client => {
	client.on('voiceStateUpdate', async (oldState, newState) => {
		const { guild, member } = newState;

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
				bitrate: 96000,
				permissionOverwrites: [
					{
						id: member.user.id,
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
				.setTitle(`Willkommen in deinem Zimmer, ${member.user.username}!`)
				.setDescription('Wir wünschen Ihnen einen angenehmen Aufenthalt. Der Zimmerservice kann Ihnen bei ein paar Dingen behilflich sein:')
				.addFields(
					{ name: 'Abschließen:', value: '`!voice lock`', inline: true },
					{ name: 'Aufschließen:', value: '`!voice unlock`', inline: true },
					{ name: 'Das Türschild ändern:', value: '`!voice name <name>`', inline: true },
					{ name: 'Personen einen Zweitschlüssel geben:', value: '`!voice permit <username>`', inline: false },
					{ name: 'Personen den Zweitschlüssel nehmen:', value: '`!voice reject <username>`', inline: false },
					{ name: 'Ein Personenlimit einstellen:', value: '`!voice limit <number>`', inline: false },
				)
				.setColor('#b8ff00')
				.setFooter('Falls Sie nicht zufrieden sind, können Sie sich bei dem Besitzer des Hotels (@florian#0069) beschweren.');
			customsTextChannel.send(embed).then((msg) => msg.pin());

			const jukeboxEmbed = new Discord.MessageEmbed()
				.setTitle('[DEMO] Jukebox')
				.setDescription(`
Du kannst dir deine Lieblingssong abspeichern 
und diese dann per Shortcut abspielen!

\`!jukebox save <song>\` - Speichere einen Song ab
\`!jukebox delete <number>\` - Lösche einen Song

Deine gespeichterten Songs:
:one: NO HUGS - Ufo361
:two: 7 million ways - Rass Limit
:three: Ohne dich - KASIMIR1441
:four: WINGS - Ufo361
:five: Hilf mir - Edo Saiya`)
				.setFooter('Du kannst maximal fünf Songs abspeichern!')
				.setColor('#f77600');
			customsTextChannel.send(jukeboxEmbed).then(async (msg) => {
				await msg.react('1️⃣');
				await msg.react('2️⃣');
				await msg.react('3️⃣');
				await msg.react('4️⃣');
				await msg.react('5️⃣');
			});

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
			mainChannel.updateOverwrite(newState.id, { VIEW_CHANNEL: false });
		}
		else if (newState.channelID === null) {
			textChannel.updateOverwrite(newState.id, { VIEW_CHANNEL: false });
			mainChannel.updateOverwrite(newState.id, { VIEW_CHANNEL: true });
		}

		if (customsId !== null) {
			if (newState.channelID !== null) return;
			if (channel.members.size !== 0) return;
			channel.delete();
			textChannel.delete();
			mainChannel.updateOverwrite(member.user.id, { VIEW_CHANNEL: true });
		}
	});
};