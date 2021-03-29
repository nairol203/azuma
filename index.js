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
	console.log('Azuma > Loaded ' + client.commands.size + ' command' + (client.commands.size == 1 ? '' : 's') + ' and ' + eventFiles.length + ' feature' + (eventFiles.length == 1 ? '' : 's') + '.');
	// console.log(await get('255741114273759232'));
	// client.api.applications(client.user.id).guilds('255741114273759232').commands('').delete()
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
			reply(interaction, command.callback({ client, args, interaction, prefix }));
		}
		catch (error) {
			console.error(error);
		}
	});
});

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

client.login(process.env.TOKEN);