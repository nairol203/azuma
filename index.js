require('dotenv').config();

const Discord = require('discord.js');
const WOKCommands = require('wokcommands');
const mongo = require('./mongo');

const client = new Discord.Client({
	partials: ['MESSAGE', 'REACTION'],
});
const prefix = process.env.PREFIX;

client.on('ready', async () => {
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

client.login(process.env.TOKEN);