const { MessageEmbed } = require('discord.js');

module.exports = {
	description: 'How to: Social Interaction',
	callback: ({ interaction }) => {
        const user = interaction.member.user;
			const embed = new MessageEmbed()
            .setAuthor(`${user.username}#${user.discriminator}`, `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.webp`)
			.setColor('#f77600')
			.setTitle('How to: Social Interaction')
			.setDescription('Tipp: Groß- und Kleinschreibung ist egal.')
			.addFields (
				{ name: 'Step 1:', value: 'Sag "Hallo", "Hi", "Hey" or "Moin"' },
				{ name: 'Step 2:', value: 'Frag "Wie geht\'s?" or "Alles gut?"' },
				{ name: 'Step 3:', value: 'Frag "Was machst du?"' },
				{ name: 'Step 4:', value: 'Sag "Tschüss", "Bye" or "Bis später"\nOder: "Gute Nacht", "Gude Nacht", "GuNa" or "guna"\nOder: "Guten Morgen, "Guden Morjen", "Gumo"' },
				{ name: 'Optional Steps:', value: '- Frag "Was geht?"\n- Frag nach einem Hug\n- Benutze Pog-Emotes' },
			)
            .setFooter('Azuma | Contact @florian#0002 for help.', `https://cdn.discordapp.com/avatars/${client.user.id}/${client.user.avatar}.webp`);
		return embed;
	},
};