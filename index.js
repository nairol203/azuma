require('dotenv').config();

const Discord = require('discord.js');
const WOKCommands = require('wokcommands');
const DisTube = require('distube');

const client = new Discord.Client({
	partials: ['MESSAGE', 'REACTION'],
});
const prefix = process.env.PREFIX;

client.on('ready', () => {
	client.user.setActivity(`${prefix}help`, { type : 'PLAYING' });

	new WOKCommands(client, {
		commandsDir: 'commands',
		featureDir: 'features',
		messagesPath: 'messages.json',
		showWarns: false,
	})
		.setDefaultPrefix(prefix)
		.setDefaultLanguage('german')
		.setMongoPath(process.env.MONGO_URI)
		.setBotOwner('255739211112513536');
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

client.distube = new DisTube(client, { searchSongs: false, emitNewSongOnly: true });

client.distube
	.on('playSong', (message, song) => message.channel.send(
		`\`${song.name}\` - \`${song.formattedDuration}\` wird gespielt.\nRequested by: ${song.user}`,
	))
	.on('addSong', (message, song) => message.channel.send(
		`${song.name} - \`${song.formattedDuration}\` wurde von ${song.user} zur Queue hinzugefügt.`,
	))
	.on('playList', (message, playlist, song) => message.channel.send(
		`Playlist \`${playlist.name}\` wird abgespielt.\nRequested by: ${song.user}\nNow playing \`${song.name}\` - \`${song.formattedDuration}\``,
	))
	.on('addList', (message, song, playlist) => message.channel.send(
		`Playlist \`${playlist.name}\` wurde von ${song.user} zur Queue hinzugefügt. `,
	));

client.login(process.env.TOKEN);