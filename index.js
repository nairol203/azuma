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

const guildId = '255741114273759232';

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
	});
}

async function get(guildId) {
	const app = client.api.applications(client.user.id);
	if (guildId) {
		app.guilds(guildId);
	}
	return app.commands.get();
}

client.on('ready', async () => {
	await mongo();
	cooldown.updateCooldown();
	console.log('Azuma > Loaded ' + client.commands.size + ' command' + (client.commands.size == 1 ? '' : 's') + ' and ' + featuresFiles.length + ' feature' + (featuresFiles.length == 1 ? '' : 's') + '.');
	// console.log(await get(guildId));
	const name = 'leaderboard';
	const description = 'Zeigt das Leaderboard vom Level-System an';
	const options = [];
	if (name && description) {
		await create(name, description, options, guildId);
	}

	client.ws.on('INTERACTION_CREATE', async (interaction) => {
		const { name, options } = interaction.data;
		const userId = interaction.member.user.id;
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
		if (command.disabled) return;
		if (command.ownerOnly && userId != '255739211112513536') {
			return reply(interaction, 'Nur der Bot-Owner kann diesen Befehl benutzen.');
		}
		// if (command.requiredPermissions) {
		// 	const channel = client.channels.cache.get(interaction.channel_id);
		// 	const authorPerms = channel.permissionsFor(message.author);
		// 	if (!authorPerms || !authorPerms.has(command.requiredPermissions)) {
		// 		return `Du brauchst die Berechtigung \`${command.requiredPermissions}\` um diesen Befehl zu benutzen.`;
		// 	}
		// }
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
			reply(interaction, command.callback({ client, args, interaction, prefix }));
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
	if (message.content.startsWith('!')) return message.channel.send('Azuma unterstüzt jetzt Discord-Slash-Commands! Das heißt aber auch, das der Bot jetzt eine andere Prefix (/) hat. Hoffe es ist nicht zu scheiße sich umzugewöhnen <:FeelsOkayMan:743222752449790054>\nDein cooler Gamer Florian :)')
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
		message.channel.send(`<:no:767394810909949983> Error occured while running ${commandName} command`);
	}
});

client.login(process.env.TOKEN);