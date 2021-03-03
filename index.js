require('dotenv').config();
const mongo = require('./mongo');

const fs = require('fs');
const Discord = require('discord.js');
const prefix = process.env.PREFIX;

const client = new Discord.Client();
client.commands = new Discord.Collection();

const commandFolders = fs.readdirSync('./commands');

for (const folder of commandFolders) {
	const commandFiles = fs.readdirSync(`./commands/${folder}`).filter(file => file.endsWith('.js'));
	for (const file of commandFiles) {
		const command = require(`./commands/${folder}/${file}`);
		const commandName = file.toString().replace('.js', '');
		client.commands.set(commandName, command);
	}
}

const chatting = require('./features/chatting');
const customs = require('./features/customs');
const cds = require('./features/cooldowns');
const jukebox = require('./features/jukebox');
const levels = require('./features/levels');
const modmail = require('./features/modmail');
const mute = require('./features/mute');
const rollenverteilung = require('./features/rollenverteilung');
const welcome = require('./features/welcome');
const { cpuUsage } = require('process');

const cooldowns = new Discord.Collection();

client.once('ready', async () => {
	await mongo();

	chatting(client);
	cds.updateCooldown();
	customs(client);
	jukebox(client);
	levels(client);
	modmail(client);
	mute(client);
	rollenverteilung(client);
	welcome(client);

	console.log('Ready!');
});

client.on('message', async message => {
	if (!message.content.startsWith(prefix) || message.author.bot) return;

	const args = message.content.slice(prefix.length).trim().split(/ +/);
	const commandName = args.shift().toLowerCase();

	const command = client.commands.get(commandName)
		|| client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

	if (!command) return;
	if (command.disabled) {
		return;
	}
	if (!command.guildOnly && message.channel.type === 'dm') {
		return message.reply('du kannst diesen Befehl nicht in Direktnachrichten benutzen.');
	}

	if (command.ownerOnly && message.author.id != '255739211112513536') {
		return message.reply('nur der Bot-Owner kann diesen Befehl benutzen.');
	}

	if (command.requiredPermissions) {
		const authorPerms = message.channel.permissionsFor(message.author);
		if (!authorPerms || !authorPerms.has(command.requiredPermissions)) {
			return message.reply(`du brauchst die Berechtigung \`${command.requiredPermissions}\` um diesen Befehl zu benutzen.`);
		}
	}

	if ((args.length > command.maxArgs) || (args.length < command.minArgs) || (command.args && !args.length)) {
		let reply = `versuche es so: \`${prefix}${commandName}\``;

		if (command.expectedArgs) {
			reply = `versuche es so: \`${prefix}${commandName} ${command.expectedArgs}\``;
		}

		return message.reply(reply);
	}
	const cdd = require('./features/cooldowns');
	if (command.cooldown > 600) {
		const getCd = await cdd.getCooldown(message.author.id, commandName);
		if (!getCd) {
			await cdd.setCooldown(message.author.id, commandName, command.cooldown);
		}
		else {
			message.reply(`du hast noch ${getCd.cooldown} Sekunden Cooldown!`);
		}
	}
	if (command.cooldown <= 600) {
		if (!cooldowns.has(commandName)) {
			cooldowns.set(commandName, new Discord.Collection());
		}

		const now = Date.now();
		const timestamps = cooldowns.get(commandName);
		const cooldownAmount = (command.cooldown || 0) * 1000;
		if (timestamps.has(message.author.id)) {
			const expirationTime = timestamps.get(message.author.id) + cooldownAmount;
			console.log(expirationTime, now)

			if (now < expirationTime) {
				const timeLeft = (expirationTime - now) / 1000;
				console.log(timeLeft)
				return message.reply(`du kannst diesen Befehl in ${timeLeft.toFixed(1)} Sekunden wieder benutzen.`);
			}
		}
		timestamps.set(message.author.id, now);
		setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);
	}



	try {
		command.callback({ client, message, args });
	}
	catch (error) {
		console.error(error);
		message.channel.send(`<:no:767394810909949983> Error occured while running ${commandName} command`);
	}
});

client.login(process.env.TOKEN);