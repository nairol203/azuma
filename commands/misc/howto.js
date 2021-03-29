const { MessageEmbed } = require('discord.js');

module.exports = {
	description: 'How to: Social Interaction',
	callback: ({}) => {
			const embed = new MessageEmbed()
			.setColor('#f77600')
			.setTitle('How to: Social Interaction')
			.setDescription('Tipp: Groß- und Kleinschreibung ist egal.')
			.addFields (
				{ name: 'Step 1:', value: 'Sag "Hallo", "Hi", "Hey" or "Moin"' },
				{ name: 'Step 2:', value: 'Frag "Wie geht\'s?" or "Alles gut?"' },
				{ name: 'Step 3:', value: 'Frag "Was machst du?"' },
				{ name: 'Step 4:', value: 'Sag "Tschüss", "Bye" or "Bis später"\nOder: "Gute Nacht", "Gude Nacht", "GuNa" or "guna"\nOder: "Guten Morgen, "Guden Morjen", "Gumo"' },
				{ name: 'Optional Steps:', value: '- Frag "Was geht?"\n- Frag nach einem Hug\n- Benutze Pog-Emotes' },
			);
		return embed;
	},
};