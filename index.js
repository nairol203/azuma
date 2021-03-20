require('dotenv').config();

const fs = require('fs');
const Discord = require('discord.js');
const mongo = require('./mongo');
const prefix = process.env.PREFIX;

const client = new Discord.Client({ partials: ['MESSAGE', 'CHANNEL', 'REACTION'] });
client.commands = new Discord.Collection();
const cooldown = require('./cooldowns');
const { no } = require('./emoji.json');

const commandFolders = fs.readdirSync('./commands');

for (const folder of commandFolders) {
	const commandFiles = fs.readdirSync(`./commands/${folder}`).filter(file => file.endsWith('.js'));
	for (const file of commandFiles) {
		const command = require(`./commands/${folder}/${file}`);
		const commandName = file.toString().replace('.js', '');
		client.commands.set(commandName, command);
	}
}

async function create(name, description, options, guildId) {
	const app = client.api.applications(client.user.id);
	if (guildId) {
		app.guilds(guildId);
	}
	app.commands.post({
		data: {
			name: name,
			description: description,
			options: options,
		},
	}).then(console.log('Azuma > Posted Slash-Command: ' + name));
}

const eventFiles = fs.readdirSync('./events').filter(file => file.endsWith('.js'));

for (const file of eventFiles) {
	const event = require(`./events/${file}`);
	client.on(event.name, (...args) => event.run(...args, client));
}

const cooldowns = new Discord.Collection();

async function get(guildId) {
	const app = client.api.applications(client.user.id);
	if (guildId) {
		app.guilds(guildId);
	}
	return app.commands.get();
}

// const newswire = require('./features/newswire');
// new newswire('gtav', 'https://discord.com/api/webhooks/819676913886298192/4S9csxzV8S6UhqWZ42t_sQr7MahQBeE4Yo-fwMu5H8R2IMn0GUgB12Q03Bhs6wTClrei');

client.on('ready', async () => {
	client.user.setActivity('FINAL FANTASY XIV', { type : 'PLAYING' });
	console.log('Azuma > Loaded ' + client.commands.size + ' command' + (client.commands.size == 1 ? '' : 's') + ' and ' + eventFiles.length + ' feature' + (eventFiles.length == 1 ? '' : 's') + '.');
	// console.log(await get('255741114273759232'));
	// client.api.applications(client.user.id).guilds('255741114273759232').commands('820294375770423316').delete() 

	for (let command of client.commands) {
		cmd = command[1];
		if ((cmd.slash) && (cmd.update)) {
			if (cmd.update === false) return;
			if (!cmd.description) console.warn('Azuma > No Description in ' + command[0] + '.js');
			const name = command[0];
			const description = cmd.description;
			const options = cmd.options || [];
			if (name && description) {
				await create(name, description, options, '255741114273759232');
	
			}
		}
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
		if (!command.slash) return;
		if (command.disabled) return reply(interaction, 'Dieser Befehl ist aktuell deaktiviert!');
		if (command.ownerOnly && userId != '255739211112513536') {
			return reply(interaction, 'Nur der Bot-Owner kann diesen Befehl benutzen.');
		}
		if (command.requiredPermissions) {
			const channel = client.channels.cache.get(interaction.channel_id);
			const authorPerms = channel.permissionsFor(user);
			if (!authorPerms || !authorPerms.has(command.requiredPermissions)) {
				return reply(interaction, `Du brauchst die Berechtigung \`${command.requiredPermissions}\` um diesen Befehl zu benutzen.`);
			}
		}
		if (command.cooldown > 600) {
			const getCd = await cooldown.getCooldown(userId, commandName);
			if (!getCd) {
				await cooldown.setCooldown(userId, commandName, command.cooldown);
			}
			else {
				const result = await cooldown.mathCooldown(userId, commandName);
				return reply(interaction, `Du hast noch **${result}**Cooldown!`);
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
					return reply(interaction, `Du kannst diesen Befehl in ${timeLeft.toFixed(0)} Sekunde` + (timeLeft.toFixed(0) == 1 ? '' : 'n') + ' wieder benutzen.');
				}
			}
			timestamps.set(userId, now);
			setTimeout(() => timestamps.delete(userId), cooldownAmount);
		}
		try {
			const callback = await command.callback({ client, args, interaction, prefix })
			if (!callback) {
				try {
					client.api.interactions(interaction.id, interaction.token).callback.post({
						data: {
							type: 5,
						},
					});
				}
				catch (error) {
					console.error(error);
				}
			}
			reply(interaction, callback);
		}
		catch (error) {
			console.error(error);
		}
	});
});

async function reply(interaction, response) {
	const content = await response
	let data = {
		content: content
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
	if (message.content.startsWith('!')) return message.channel.send('Azuma unterstützt jetzt Discord-Slash-Commands! Das heißt aber auch, das der Bot jetzt eine andere Prefix hat: **/**')
	if (!message.content.startsWith(prefix) || message.author.bot) return;

	const args = message.content.slice(prefix.length).trim().split(/ +/);
	const commandName = args.shift().toLowerCase();
	const command = client.commands.get(commandName)
		|| client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

	if (!command) return;
	if (command.slash == true) return;
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
		command.callback({ client, message, args, prefix, Discord });
	}
	catch (error) {
		console.error(error);
		message.channel.send(no + ` Error occured while running ${commandName} command`);
	}
});

client.login(process.env.TOKEN);