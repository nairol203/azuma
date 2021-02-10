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

const DisTube = require('distube');

client.distube = new DisTube(client, { searchSongs: false, emitNewSongOnly: true });
const status = (queue) => `Volume: \`${queue.volume}%\` | Filter: \`${queue.filter || 'Off'}\` | Loop: \`${queue.repeatMode ? queue.repeatMode == 2 ? 'All Queue' : 'This Song' : 'Off'}\` | Autoplay: \`${queue.autoplay ? 'On' : 'Off'}\``;

client.distube
	.on('playSong', (message, queue, song) => message.channel.send(
		`Playing \`${song.name}\` - \`${song.formattedDuration}\`\nRequested by: ${song.user}\n${status(queue)}`,
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