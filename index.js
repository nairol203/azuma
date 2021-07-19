require('dotenv').config();
const { readdirSync} = require('fs');
const { Client, Collection, MessageActionRow, MessageButton } = require("discord.js");
const { updateCooldown, setCooldown, getCooldown, mathCooldown } = require('./features/cooldowns');
const mongo = require('./mongo');

const prefix = process.env.PREFIX;
const guildID = process.env.GUILD_ID;
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
	if (maintenance) {
		console.log(client.user.username + ' > Maintenance is active!');
		client.user.setActivity('Wartungsarbeiten', { type : 'PLAYING' });
	}
    else {
        client.user.setActivity('https://bit.ly/azuma_', { type : 'STREAMING' });
    };
	console.log(client.user.username + ' > Loaded ' + client.commands.size + ' command' + (client.commands.size == 1 ? '' : 's') + ' and ' + eventFiles.length + ' event' + (eventFiles.length == 1 ? '.' : 's.'));
    const globalCommands = await client.application?.commands.fetch();
    const guildCommands = await client.guilds.cache.get(guildID)?.commands.fetch();
	console.log(client.user.username + ' > Found ' + (globalCommands.size || 0) + ' Global Command' + (globalCommands.size == 1 ? '' : 's') + ' and ' + (guildCommands.size || 0) + ' Guild Command' + (globalCommands.size == 1 ? '.' : 's.'));
    for (let command of client.commands) {
        cmd = command[1];
        if (!cmd?.update) continue;
        if (!cmd?.description) {
            console.warn(client.user.username + ` > No Description in ${command[0]}.js`);
            continue;
        };
        const data = {
            name: command[0],
            description: cmd.description,
            options: cmd?.options || [],
        };
        if (cmd.guildOnly) {
            try {
                await client.guilds.cache.get(guildID)?.commands.create(data);
                console.log(client.user.username + ` > Posted Guild Command: /${command[0]}`);
            }
            catch (e) {
                console.error(e);
            };
        }
        else {
            try {
                await client.application?.commands.create(data);
                console.log(client.user.username + ` > Posted Command: /${command[0]}`);
            }
            catch (e) {
                console.error(event);
            };
        };

    };
});

client.on('interaction', async interaction => {
    if (!interaction.isCommand()) return;
    const row = new MessageActionRow()
        .addComponents(
            new MessageButton()
                .setURL('https://discord.com/oauth2/authorize?client_id=772508572647030796&permissions=19982400&scope=bot%20applications.commands')
                .setLabel('Invite')
                .setStyle('LINK')
        )
    if (!interaction?.guildID) return interaction.reply({ content: `Slash-Commands von Azuma können nur in Servern genutzt werden. Lade mich auf deinen Server ein, um sie zu benutzen!`, components: [row], ephemeral: true });
    const userID = interaction.member.user.id;
    const commandName = interaction.commandName;
    const command = client.commands.get(commandName) || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));
    if (!command) return;
    if (maintenance && userID != '255739211112513536') return interaction.reply({ content: `Aktuell finden Wartungsarbeiten statt. Bitte versuche es später nochmal!`, ephemeral: true });
    if (command.disabled) return interaction.reply({ content: 'Dieser Befehl ist aktuell deaktiviert. Bitte versuche es später nochmal!', ephemeral: true });
    if (command.cooldown > 600) {
        const getCd = await getCooldown(userID, commandName);
        if (!getCd) {
            await setCooldown(userID, commandName, command.cooldown);
        }
        else {
            const result = await mathCooldown(userID, commandName);
            return interaction.reply({ content: `Du hast noch **${result}** Cooldown auf diesem Befehl.`, ephemeral: true });
        };
    }
    else {
        if (!cooldowns.has(commandName)) {
            cooldowns.set(commandName, new Collection());
        };
        const now = Date.now();
        const timestamps = cooldowns.get(commandName);
        const cooldownAmount = (command.cooldown || 0) * 1000;
        if (timestamps.has(userID)) {
            const expirationTime = timestamps.get(userID) + cooldownAmount;
            if (now < expirationTime) {
                const timeLeft = (expirationTime - now) / 1000;
                return interaction.reply({ content: `Du kannst diesen Befehl in ${timeLeft.toFixed(0)} Sekunde` + (timeLeft.toFixed(0) == 1 ? '' : 'n') + ' wieder benutzen.', ephemeral: true });
            };
        };
        timestamps.set(userID, now);
        setTimeout(() => timestamps.delete(userID), cooldownAmount);
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
	try {
		command.callback({ client, message, args });
	}
	catch (e) {
		console.error(e);
	}
});

client.login(process.env.TOKEN);