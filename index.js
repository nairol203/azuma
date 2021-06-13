require('dotenv').config();
const { readdirSync} = require('fs');
const { Client, Collection } = require("discord.js");
const { updateCooldown, setCooldown, getCooldown, mathCooldown } = require('./cooldowns');
const mongo = require('./mongo');

const prefix = process.env.PREFIX;
const guildId = process.env.GUILD_ID;
const maintenance = false;

const client = new Client({ intents: ['GUILDS', 'GUILD_MESSAGES', 'GUILD_VOICE_STATES', 'GUILD_MESSAGE_REACTIONS'], partials: ['MESSAGE', 'CHANNEL', 'REACTION'] });
const cooldowns = new Collection();
client.commands = new Collection();

const commandFolders = readdirSync('./commands');
const eventFiles = readdirSync('./events').filter(file => file.endsWith('.js'));

for (const folder of commandFolders) {
	const commandFiles = readdirSync(`./commands/${folder}`).filter(file => file.endsWith('.js'));
	for (const file of commandFiles) {
		const command = require(`./commands/${folder}/${file}`);
		const commandName = file.toString().replace('.js', '');
		client.commands.set(commandName, command);
	}
};

for (const file of eventFiles) {
	const event = require(`./events/${file}`);
	client.on(event.name, (...args) => event.run(...args, client));
};

client.on('ready', async () => {
    await mongo();
    updateCooldown();
	console.log(client.user.username + ' > Loaded ' + client.commands.size + ' command' + (client.commands.size == 1 ? '' : 's') + ' and ' + eventFiles.length + ' event' + (eventFiles.length == 1 ? '' : 's') + '.');
    const globalCommands = await get(); const guildCommands = await get(guildId);
	console.log(client.user.username + ' > Found ' + (globalCommands.length || 0) + ' Global Commands and ' + (guildCommands.length || 0) + ' Guild Commands.')
});

async function get(guildId) {
	const app = client.api.applications(client.user.id);
	if (guildId) {
		app.guilds(guildId);
	}
	return app.commands.get();
}

client.on('interaction', async interaction => {
    if (!interaction.isCommand()) return;
    const userId = interaction.member.user.id;
    const commandName = interaction.commandName;
    const command = client.commands.get(commandName) || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));
    if (!command) return;
    if (maintenance && userId != '255739211112513536') return interaction.reply({ content: `Aktuell finden Wartungsarbeiten an <@${client.user.id}> statt. Bitte versuche es später nochmal!`, ephemeral: true });
    if (command.disabled) return interaction.reply({ content: 'Dieser Befehl ist aktuell deaktiviert!', ephemeral: true });
    if (command.cooldown > 600) {
        const getCd = await getCooldown(userId, commandName);
        if (!getCd) {
            await setCooldown(userId, commandName, command.cooldown);
        }
        else {
            const result = await mathCooldown(userId, commandName);
            return interaction.reply({ content: `Du hast noch **${result}**Cooldown!`, ephemeral: true });
        };
    }
    else {
        if (!cooldowns.has(commandName)) {
            cooldowns.set(commandName, new Collection());
        };
        const now = Date.now();
        const timestamps = cooldowns.get(commandName);
        const cooldownAmount = (command.cooldown || 0) * 1000;
        if (timestamps.has(userId)) {
            const expirationTime = timestamps.get(userId) + cooldownAmount;
            if (now < expirationTime) {
                const timeLeft = (expirationTime - now) / 1000;
                return interaction.reply({ content: `Du kannst diesen Befehl in ${timeLeft.toFixed(0)} Sekunde` + (timeLeft.toFixed(0) == 1 ? '' : 'n') + ' wieder benutzen.', ephemeral: true });
            };
        };
        timestamps.set(userId, now);
        setTimeout(() => timestamps.delete(userId), cooldownAmount);
    };
    try {
        command.callback({ client, interaction });
    }
    catch(e) {
        console.error(e);
    };
});

client.on('message', async message => {
	if (message.content.toLowerCase().includes('kek'.toLowerCase())) message.delete();
	if (!message.content.startsWith(prefix) || message.author.bot) return;

	const args = message.content.slice(prefix.length).trim().split(/ +/);
	const commandName = args.shift().toLowerCase();
	const command = client.commands.get(commandName)
		|| client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

	if (!command) return;
	if (message.author.id != '255739211112513536') return;
    message.delete()
	try {
		command.callback({ client, message, args });
	}
	catch (e) {
		console.error(e);
	}
});

client.login(process.env.TOKEN);