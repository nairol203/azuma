require('dotenv').config();

const Discord = require('discord.js');
const WOKCommands = require('wokcommands');
const mongo = require('./mongo');

const client = new Discord.Client({
	partials: ['MESSAGE', 'REACTION'],
});
const prefix = process.env.PREFIX;

client.on('ready', async () => {
	client.user.setActivity(`${prefix}help`, { type : 'PLAYING' });

	await mongo();

	new WOKCommands(client, {
		commandsDir: 'commands',
		featureDir: 'features',
		messagesPath: 'messages.json',
		showWarns: false,
	})
		.setDefaultPrefix(prefix)
		.setDefaultLanguage('german')
		.setMongoPath(process.env.MONGO_URI)
		.setBotOwner(['255739211112513536']);
});

client.on('message', message => {
	if (message.channel.id === '794366711565385768' || message.channel.id === '365763570371133451') {
		message.channel.messages.fetch({ limit: 99 })
			.then(fetched => {
				const notPinned = fetched.filter(fetchedMsg => !fetchedMsg.pinned);
				setTimeout(function() {
					message.channel.bulkDelete(notPinned, true);
				}, 10000);
			})
			.catch(console.error);
	}
});

const DisTube = require('distube');

client.distube = new DisTube(client, { searchSongs: false, emitNewSongOnly: true });
const status = (queue) => '';

client.distube
	.on('playSong', (message, queue, song) => message.channel.send(
		`:notes: | \`${song.name}\` - \`${song.formattedDuration}\` wird gespielt...\n${status(queue)}`,
	))
	.on('addSong', (message, queue, song) => message.channel.send(
		`:notes: | ${song.name} - \`${song.formattedDuration}\` wurde zur Queue hinzugefügt.\n${status(queue)}`,
	))
	.on('playList', (message, queue, playlist, song) => message.channel.send(
		`:notes: | Die Playlist \`${playlist.name}\` mit ${playlist.songs.length} Songs wurde zur Queue hinzugefügt.\n:notes: | \`${song.name}\` - \`${song.formattedDuration}\` wird gespielt...\n${status(queue)}`,
	))
	.on('addList', (message, queue, playlist) => message.channel.send(
		`:notes: | Die Playlist \`${playlist.name}\` mit ${playlist.songs.length} Songs wurde zur Queue hinzugefügt.\n${status(queue)}`,
	))
	.on('searchResult', (message, result) => {
		let i = 0;
		const embed = new Discord.MessageEmbed()
			.setTitle('Suchergebnisse:')
			.setDescription(`\n${result.map(song => `**${++i}**. ${song.name} - \`${song.formattedDuration}\``).join('\n')}`)
			.setFooter('Wähle einen Song von 1-10 aus.')
			.setColor('#fabe00');
		message.channel.send(embed);
	})
	.on('searchCancel', (message) => message.channel.send('<:no:767394810909949983> | Es wurde keine gültige Eingabe erkannt.'))
	.on('error', (message, e) => {
		console.error(e);
		message.channel.send('<:no:767394810909949983> | Error occured while running search command.');
	});

client.login(process.env.TOKEN);