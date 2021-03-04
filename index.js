require('dotenv').config();

const fs = require('fs');
const Discord = require('discord.js');
const mongo = require('./mongo');
const prefix = process.env.PREFIX;

const client = new Discord.Client({ partials: ['MESSAGE', 'CHANNEL', 'REACTION'] });
client.commands = new Discord.Collection();

const cooldown = require('./features/cooldowns');
const commandFolders = fs.readdirSync('./commands');

for (const folder of commandFolders) {
	const commandFiles = fs.readdirSync(`./commands/${folder}`).filter(file => file.endsWith('.js'));
	for (const file of commandFiles) {
		const command = require(`./commands/${folder}/${file}`);
		const commandName = file.toString().replace('.js', '');
		client.commands.set(commandName, command);
	}
}

const featuresFiles = fs.readdirSync('./features').filter(file => file.endsWith('.js'));

for (const file of featuresFiles) {
	const feature = require(`./features/${file}`);
	client.on(feature.name, (...args) => feature.run(...args, client));
}

const cooldowns = new Discord.Collection();

client.once('ready', async () => {
	await mongo();
	cooldown.updateCooldown();
	console.log('Azuma > Loaded ' + client.commands.size + ' command' + (client.commands.size == 1 ? '' : 's') + ' and ' + featuresFiles.length + ' feature' + (featuresFiles.length == 1 ? '' : 's') + '.');
});

client.on('message', async message => {
	if (!message.content.startsWith(prefix) || message.author.bot) return;

	const args = message.content.slice(prefix.length).trim().split(/ +/);
	const commandName = args.shift().toLowerCase();
	const command = client.commands.get(commandName)
		|| client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

	if (!command) return;
	if (command.disabled) return;
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
	if (command.cooldown > 600) {
		const getCd = await cooldown.getCooldown(message.author.id, commandName);
		if (!getCd) {
			await cooldown.setCooldown(message.author.id, commandName, command.cooldown);
		}
		else {
			const result = await cooldown.mathCooldown(message.author.id, commandName);
			return message.reply(`du hast noch **${result}**Cooldown!`);
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
			if (now < expirationTime) {
				const timeLeft = (expirationTime - now) / 1000;
				return message.reply(`du kannst diesen Befehl in ${timeLeft.toFixed(0)} Sekunde` + (timeLeft.toFixed(0) == 1 ? '' : 'n') + ' wieder benutzen.');
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