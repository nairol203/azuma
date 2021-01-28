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

client.login(process.env.TOKEN);