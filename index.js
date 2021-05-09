require('dotenv').config();

const fs = require('fs');
const Discord = require('discord.js');
const mongo = require('./mongo');
const cooldown = require('./cooldowns');
const { no } = require('./emoji.json');

const prefix = process.env.PREFIX;
const guildId = process.env.GUILD_ID;
const maintenance = false;

const client = new Discord.Client({ partials: ['MESSAGE', 'CHANNEL', 'REACTION'] });
const cooldowns = new Discord.Collection();
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

const eventFiles = fs.readdirSync('./events').filter(file => file.endsWith('.js'));

for (const file of eventFiles) {
	const event = require(`./events/${file}`);
	client.on(event.name, (...args) => event.run(...args, client));
}

client.on('ready', async () => {
	if (maintenance) {
		console.log(client.user.username + ' > Maintenance is active!')
		client.user.setActivity('Wartungsarbeiten', { type : 'PLAYING' })
	}
	const logChannel = client.channels.cache.get('781501076725563413')
	logChannel.send('Bot restarted successfully with ' + client.commands.size + ' commands.')
	console.log(client.user.username + ' > Loaded ' + client.commands.size + ' command' + (client.commands.size == 1 ? '' : 's') + ' and ' + eventFiles.length + ' event' + (eventFiles.length == 1 ? '' : 's') + '.');
	const globalCommands = await get(); const guildCommands = await get(guildId);
	console.log(client.user.username + ' > Found ' + (globalCommands.length || 0) + ' Global Commands and ' + (guildCommands.length || 0) + ' Guild Commands.')
	globalCommands = Object.values(globalCommands); guildCommands = Object.values(guildCommands);
	for (globalCmd of globalCommands) {
		let update = false;
		const cmd = client.commands.get(globalCmd.name)
		if (!cmd) return console.log('delete ' + globalCmd.name)
		if (cmd.description !== globalCmd.description) {
			console.log(globalCmd.name + ': description doesn\'t match! updating cmd...')
			update = true;
		}
		if (cmd.options !== globalCmd.options) {
			console.log(globalCmd.name + ': options doesn\'t match! updating cmd...')
			update = true;
		}
		if (!update) return console.log(globalCmd.name + ' looks fine!');
		console.log('update ' + globalCmd.name)
	}
	for (guildCmd of guildCommands) {
		let update = false;
		const cmd = client.commands.get(guildCmd.name)
		if (!cmd) return console.log('delete ' + guildCmd.name)
		if (cmd.description !== guildCmd.description) {
			console.log(guildCmd.name + ': description doesn\'t match! updating cmd...')
			update = true;
		}
		if (cmd.options !== guildCmd.options) {
			console.log(guildCmd.name + ': options doesn\'t match! updating cmd...')
			update = true;
		}
		if (update) return console.log(guildCmd.name + ' looks fine!');
		console.log('update ' + guildCmd.name)
	}
});

client.on('ready', async () => {
	await mongo();
	cooldown.updateCooldown();

	client.ws.on('INTERACTION_CREATE', async (interaction) => {
		const { name, options } = interaction.data;
		const userId = interaction.member.user.id;
		const user = client.users.cache.get(userId)
		const commandName = name.toLowerCase();
		const args = {};
		if (options) {
			for (const option of options) {
				const { name, value } = option;
				args[name] = value;
			}
		}
		const command = client.commands.get(commandName)
		|| client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));
		if (!command) return;
		if (maintenance && userId != '255739211112513536') return reply(interaction, no + ` Aktuell finden Wartungsarbeiten an <@${client.user.id}> statt. Bitte versuche es später nochmal!`, 64)
		if (command.disabled) return reply(interaction, no + ' Dieser Befehl ist aktuell deaktiviert!', 64);
		if (command.ownerOnly && userId != '255739211112513536') {
			return reply(interaction, no + ' Nur der Bot-Owner kann diesen Befehl benutzen.', 64);
		}
		if (command.requiredPermissions) {
			const channel = client.channels.cache.get(interaction.channel_id);
			const authorPerms = channel.permissionsFor(user);
			if (!authorPerms || !authorPerms.has(command.requiredPermissions)) {
				return reply(interaction, no + ` Du brauchst die Berechtigung \`${command.requiredPermissions}\` um diesen Befehl zu benutzen.`, 64);
			}
		}
		if (command.cooldown > 600) {
			const getCd = await cooldown.getCooldown(userId, commandName);
			if (!getCd) {
				await cooldown.setCooldown(userId, commandName, command.cooldown);
			}
			else {
				const result = await cooldown.mathCooldown(userId, commandName);
				return reply(interaction, no + ` Du hast noch **${result}**Cooldown!`, 64);
			}
		}
		if (command.cooldown <= 600) {
			if (!cooldowns.has(commandName)) {
				cooldowns.set(commandName, new Discord.Collection());
			}
			const now = Date.now();
			const timestamps = cooldowns.get(commandName);
			const cooldownAmount = (command.cooldown || 0) * 1000;
			if (timestamps.has(userId)) {
				const expirationTime = timestamps.get(userId) + cooldownAmount;
				if (now < expirationTime) {
					const timeLeft = (expirationTime - now) / 1000;
					return reply(interaction, no + ` Du kannst diesen Befehl in ${timeLeft.toFixed(0)} Sekunde` + (timeLeft.toFixed(0) == 1 ? '' : 'n') + ' wieder benutzen.', 64);
				}
			}
			timestamps.set(userId, now);
			setTimeout(() => timestamps.delete(userId), cooldownAmount);
		}
		try {
			const callback = await command.callback({ client, args, interaction, prefix })
			if (Array.isArray(callback)) {
				reply(interaction, callback[0], 64);
			} else {
				reply(interaction, callback);
			}
		}
		catch (error) {
			console.error(error);
			const errChannel = client.channels.cache.get('781501076725563413')
			errChannel.send('Error occured: ' + error)
		}
	});
});

async function create(name, description, options, guildId) {
	const app = client.api.applications(client.user.id);
	if (guildId) {
		app.guilds(guildId);
	}
	app.commands.post({
		data: {
			name: name,
			description: description,
			options: options
		},
	}).then(console.log(client.user.username + ' > Posted Slash-Command: ' + name));
}

async function get(guildId) {
	const app = client.api.applications(client.user.id);
	if (guildId) {
		app.guilds(guildId);
	}
	return app.commands.get();
}

async function reply(interaction, response, flags = 1) {
	const content = await response
	let data = {
		content,
		flags
	};
	if (typeof content === 'object') {
		data = await createApiMessage(interaction, content);
	}

	client.api.interactions(interaction.id, interaction.token).callback.post({
		data: {
			type: 4,
			data,
		},
	});
}

async function createApiMessage(interaction, content) {
	const { data, files } = await Discord.APIMessage.create(
		client.channels.resolve(interaction.channel_id),
		content,
	)
		.resolveData()
		.resolveFiles();

	return { ...data, files };
}

client.on('message', async message => {
	if (!message.content.startsWith(prefix) || message.author.bot) return;

	const args = message.content.slice(prefix.length).trim().split(/ +/);
	const commandName = args.shift().toLowerCase();
	const command = client.commands.get(commandName)
		|| client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

	if (!command) return;
	if (command.disabled) return;
	if (message.author.id != '255739211112513536') {
		return;
	}
	if ((args.length > command.maxArgs) || (args.length < command.minArgs) || (command.args && !args.length)) {
		let reply = `versuche es so: \`${prefix}${commandName}\``;

		if (command.expectedArgs) {
			reply = `versuche es so: \`${prefix}${commandName} ${command.expectedArgs}\``;
		}

		return message.reply(reply);
	}
	try {
		message.delete()
		command.callback({ client, message, args });
	}
	catch (e) {
		message.delete()
		console.error(e);
		message.channel.send(no + ` Error occured while running ${commandName} command`);
	}
});

client.login(process.env.TOKEN);