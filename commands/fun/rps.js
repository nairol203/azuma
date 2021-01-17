module.exports = {
	minArgs: 1,
	maxArgs: 1,
	expectedArgs: '<schere/stein/papier>',
	callback: ({ message, args }) => {
		const acceptedReplies = ['schere', 'stein', 'papier'];
		const random = Math.floor((Math.random() * acceptedReplies.length));
		const result = acceptedReplies[random];

		const choice = args[0];
		if (!acceptedReplies.includes(choice)) return message.channel.send(`Bitte spiele mit diesen Argumenten: \`${acceptedReplies.join(', ')}\``);

		if (result === 'schere') message.channel.send('Ich habe Schere genommen <:pepeLaugh:750018556636168283> <a:TeaTime:786266751909232661>');
		if (result === 'stein') message.channel.send('Ich habe Stein genommen <:pepeLaugh:750018556636168283> <a:TeaTime:786266751909232661>');
		if (result === 'papier') message.channel.send('Ich habe Papier genommen <:pepeLaugh:750018556636168283> <a:TeaTime:786266751909232661>');

		setTimeout(function() {
			if (result === choice) return message.reply('es ist unendschieden! Gut gespielt! <:FeelsOkayMan:743222752449790054>');

			switch (choice) {
			case 'stein': {
				if (result === 'papier') return message.reply('damit habe ich gewonnen!');
				else return message.reply('du hast gewonnen! Glückwunsch! <:FeelsOkayMan:743222752449790054>');
			}
			case 'papier': {
				if (result === 'schere') return message.reply('damit habe ich gewonnen!');
				else return message.reply('du hast gewonnen! Glückwunsch! <:FeelsOkayMan:743222752449790054>');
			}
			case 'schere': {
				if (result === 'stein') return message.reply('damit habe ich gewonnen!');
				else return message.reply('du hast gewonnen! Glückwunsch! <:FeelsOkayMan:743222752449790054>');
			}
			default: {
				return message.channel.send(`Bitte spiele mit diesen Argumenten: \`${acceptedReplies.join(', ')}\``);
			}
			}
		}, 1000);

	},
};