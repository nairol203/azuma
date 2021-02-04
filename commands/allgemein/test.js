const DiscordJS = require('discord.js');

module.exports = {
	callback: ({ message }) => {
		const questions = [
			'heyywoo, wie gehts?',
			'was machste so?',
			'deine mutter ist fett',
		];
		let counter = 0;

		const filter = (m) => {
			return m.author.id === message.author.id;
		};

		const collector = new DiscordJS.MessageCollector(message.channel, filter, {
			max: questions.length,
			time: 1000 * 15,
		});

		message.channel.send(questions[counter++]);
		collector.on('collect', (m) => {
			if (counter < questions.length) {
				m.channel.send(questions[counter++]);
			}
		});

		collector.on('end', (collected) => {
			if (collected.size < questions.length) {
				return;
			}
		});
	},
};
