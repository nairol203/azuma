const customs = require('../../models/customs');

module.exports = {
	callback: async ({ client, message, args }) => {
		const { author, channel, guild } = message;
		const voiceChannel = message.member.voice.channel;
		const userId = author.id;
		const channelId = voiceChannel.id;

		if(args[0] === 'setup') {
			await guild.channels.create('Customs', {
				type: 'voice',
			});
		}

		const result = await customs.findOne({
			userId,
			channelId,
		});

		if(result === null) {
			message.delete();
			return message.reply('du hast dieses Zimmer nicht gebucht und kannst deswegen den Zimmerservice nicht in Anspruch nehmen.').then(msg => {msg.delete({ timeout: 5000 }); });
		}

		if (args[0] === 'lock') {
			message.delete();
			voiceChannel.updateOverwrite(author, { CONNECT: true });
			voiceChannel.updateOverwrite('255741114273759232', { CONNECT: false });
			channel.send('Alles klar, ich habe dein Zimmer für dich abgeschlossen.').then(msg => {msg.delete({ timeout: 5000 }); });
		}
		else if (args[0] === 'unlock') {
			message.delete();
			voiceChannel.updateOverwrite('255741114273759232', { CONNECT: true });
			channel.send('Alles klar, ich habe dein Zimmer für dich aufgeschlossen.').then(msg => {msg.delete({ timeout: 5000 }); });
		}
		else if (args[0] === 'name') {
			message.delete();
			const argument = args.join(' ');
			const name = argument.toString().replace('name ', '');
			if(!args[1]) return message.reply('versuche es so: `!voice name <name>`').then(msg => {msg.delete({ timeout: 5000 }); });
			voiceChannel.setName(name);
			channel.send(`Ich habe dein Türschild geändert: \`${name}\`.`).then(msg => {msg.delete({ timeout: 5000 }); });
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
			message.delete();
			if(!args[1]) return message.reply('versuche es so: `!voice reject <username>`').then(msg => {msg.delete({ timeout: 5000 }); });
			const argument = args.join(' ');
			const name = argument.toString().replace('reject ', '');
			const mention = client.users.cache.find(u => u.username == `${name}`);
			if (mention === undefined) return channel.send('Ich konnte niemand finden, der so heißt. Tipp: Ich kann aktuell noch keine Nicknamen verstehen!').then(message.delete({ timeout: 5000 }));
			voiceChannel.updateOverwrite(mention.id, { CONNECT: false });
			channel.send(`${mention} hat den Schlüssel zu deinem Zimmer zurückgegeben.`).then(msg => {msg.delete({ timeout: 5000 }); });
		}
		else if (args[0] === 'permit') {
			message.delete();
			if(!args[1]) return message.reply('versuche es so: `!voice permit <username>').then(msg => {msg.delete({ timeout: 5000 }); });
			const argument = args.join(' ');
			const name = argument.toString().replace('reject ', '');
			const mention = client.users.cache.find(u => u.username == `${name}`);
			if (mention === undefined) return channel.send('Ich konnte niemand finden, der so heißt. Tipp: Ich kann aktuell noch keine Nicknamen verstehen!').then(msg => {msg.delete({ timeout: 5000 }); });
			voiceChannel.updateOverwrite(mention.id, { CONNECT: true });
			channel.send(`Ich habe ${mention} den Schlüssel zu deinem Zimmer gegeben.`).then(msg => {msg.delete({ timeout: 5000 }); });
		}
		else if (args[0] === 'limit') {
			message.delete();
			const amount = parseInt(args[1]) + 1;
			if (amount > 100) return channel.send('Dein Raum hat nur eine Größe für 99 Personen!').then(msg => {msg.delete({ timeout: 5000 }); });
			if (amount <= 0) return;
			const channelLimit = args[1];
			voiceChannel.setUserLimit(channelLimit);
			channel.send(`Alles klar, ich habe das Personenlimit auf \`${channelLimit}\` gesetzt.`).then(msg => {msg.delete({ timeout: 5000 }); });
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