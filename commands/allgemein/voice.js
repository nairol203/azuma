const customsMain = require('../../schemas/customs-main');
const customs = require('../../schemas/customs');

module.exports = {
	callback: async ({ client, message, args }) => {
		const { author, channel, guild } = message;
		const voiceChannel = message.member.voice.channel;
		const userId = author.id;
		const channelId = voiceChannel.id;

		if(args[0] === 'setup') {
			const customChannel = await guild.channels.create('Customs', {
				type: 'voice',
			});
			const channelId = customChannel.id;
			const uploadChannel = await customsMain.insertMany(
				{
					channelId,
				},
			);
			return;
		}

		const result = await customs.findOne({
			userId,
			channelId,
		});

		if(result === null) {
			return message.reply('du hast dieses Zimmer nicht gebucht und kannst deswegen den Zimmerservice nicht in Anspruch nehmen.');
		}

		if (args[0] === 'lock') {
			voiceChannel.updateOverwrite(author, { CONNECT: true });
			voiceChannel.updateOverwrite('255741114273759232', { CONNECT: false });
			channel.send('Alles klar, ich habe dein Zimmer für dich abgeschlossen.');
		}
		else if (args[0] === 'unlock') {
			voiceChannel.updateOverwrite('255741114273759232', { CONNECT: true });
			channel.send('Alles klar, ich habe dein Zimmer für dich aufgeschlossen.');
		}
		else if (args[0] === 'name') {
			const argument = args.join(' ');
			const name = argument.toString().replace('name ', '');
			if(!args[1]) return message.reply('versuche es so: `!voice name <name>`');
			voiceChannel.setName(name);
			channel.send(`Ich habe dein Türschild geändert: \`${name}\`.`);
			const channelName = name;
			const uploadChannelName = await customs.findOneAndUpdate(
				{
					userId,
					channelId,
				},
				{
					userId,
					channelId,
					channelName,
				},
			);
		}
		else if (args[0] === 'reject') {
			if(!args[1]) return message.reply('versuche es so: `!voice reject <username>`');
			const argument = args.join(' ');
			const name = argument.toString().replace('reject ', '');
			const mention = client.users.cache.find(u => u.username == `${name}`);
			if (mention === undefined) return channel.send('Ich konnte niemand finden, der so heißt. Tipp: Ich kann aktuell noch keine Nicknamen verstehen!');
			voiceChannel.updateOverwrite(mention.id, { CONNECT: false });
			channel.send(`${mention} hat den Schlüssel zu deinem Zimmer zurückgegeben.`);
		}
		else if (args[0] === 'permit') {
			if(!args[1]) return message.reply('versuche es so: `!voice permit <username>');
			const argument = args.join(' ');
			const name = argument.toString().replace('reject ', '');
			const mention = client.users.cache.find(u => u.username == `${name}`);
			if (mention === undefined) return channel.send('Ich konnte niemand finden, der so heißt. Tipp: Ich kann aktuell noch keine Nicknamen verstehen!');
			voiceChannel.updateOverwrite(mention.id, { CONNECT: true });
			channel.send(`Ich habe ${mention} den Schlüssel zu deinem Zimmer gegeben.`);
		}
		else if (args[0] === 'limit') {
			const amount = parseInt(args[1]) + 1;
			if (amount > 100) return channel.send('Dein Raum hat nur eine Größe für 99 Personen!');
			if (amount <= 0) return;
			const channelLimit = args[1];
			voiceChannel.setUserLimit(channelLimit);
			channel.send(`Alles klar, ich habe das Personenlimit auf \`${channelLimit}\` gesetzt.`);
			const uploadChannelLimit = await customs.findOneAndUpdate(
				{
					userId,
					channelId,
				},
				{
					userId,
					channelId,
					channelLimit,
				},
			);
		}
	},
};