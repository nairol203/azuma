const { PogChamp, PagChomp, PagShake, PagMan, Pause, PauseChamp, WeirdChamp, pepeLaugh, peepoHey, peepoBye, peepoHug, FeelsOkayNan, FeelsBadMan, dankHug, WEEWOO } = require('../emoji.json');
require('../ExtendedMessage');

module.exports = {
	name: 'message',
	run(message) {
		if (message.author.bot) return;

		const args1 = ['hi', 'hey', 'hallo', 'moin', 'servus', 'na du'];
		if (args1.some(word => message.content.toLowerCase().startsWith(word.toLowerCase()))) {
			const messages = [
				'Na du',
				'Hallo',
				'Moin Moin!',
				peepoHey,
				'Servus!',
				'Wie geht\'s? ' + peepoHey,
			];
			const randomMessage = messages[Math.floor(Math.random() * messages.length)];
			message.inlineReply(randomMessage);
		}
		const args7 = ['guten morgen', 'guden morjen', 'gumo'];
		if (args7.some(word => message.content.toLowerCase().startsWith(word.toLowerCase()))) {
			const messages = [
				'GUMOOOO ' + peepoHey,
				'GUMOOOO ' + peepoHey,
				'GUMOOOO ' + peepoHey,
				`Gumo ` + peepoHey,
				`Gumo ` + peepoHey,
				'Guten Morgen! ' + peepoHey,
				'Guten Morgen! ' + peepoHey,
				'GUUUMOOOO! ' + peepoHey,
				'GUUUMOOOO! ' + peepoHey,
				'GUUUMOOOO! ' + peepoHey,
				'GUUUMOOOO! ' + peepoHey,
				'Guten Morgen 🥱🥱🥱',
				'Guten Morgen 🥱',
				'Guten Morgen',
				'Moin! 🥱',
				'Moin!',
			];
			const randomMessage = messages[Math.floor(Math.random() * messages.length)];
			message.inlineReply(randomMessage);
		}
		const args2 = ['alles gut', 'wie geht', 'alles fit'];
		if (args2.some(word => message.content.toLowerCase().startsWith(word.toLowerCase()))) {
			const messages = [
				'Ganz okay',
				'Muss ja^^',
				'Gut, dir? ' + FeelsOkayNan,
				'Mir geht\'s schlecht, könntest du einen Witz erzählen um mich aufzuheitern?',
				'Könn\'t nicht besser sein!',
				'Gut, danke der Nachfrage',
				'Nicht so gut, hab heute n schlechten Tag ' + FeelsBadMan,
				'Bin grad mega down ' + FeelsBadMan,
				'Willst du wirklich gerade Smalltalk mit einem Discord-Bot führen??? ' + WeirdChamp,
				'Nett dass du fragst, mir gehts supi',
			];
			const randomMessage = messages[Math.floor(Math.random() * messages.length)];
			message.inlineReply(randomMessage);
		}
		else if (message.content.toLowerCase().startsWith('was machst du'.toLowerCase())) {
			const messages = [
				'Mit 100 Leuten gleichzeitig schreiben',
				'Nichts, mir ist ziemlich langweilig ' + FeelsBadMan,
				'Darf ich nicht sagen 🤐',
				'Sportwetten dies das',
				'FÜR FORTNAIT',
				'Ein paar 90\'s cranken',
				'Hör auf mit mir zu reden 😡😡😡',
				'Mit dir schreiben',
			];
			const randomMessage = messages[Math.floor(Math.random() * messages.length)];
			message.inlineReply(randomMessage);
		}
		else if (message.content.toLowerCase().startsWith('wie ist das wetter'.toLowerCase())) {
			message.inlineReply('Schau doch aus dem Fenster');
		}
		else if (message.content.toLowerCase().startsWith('und sonst so'.toLowerCase())) {
			const messages = [
				'Joa muss ja^^',
				'Das übliche, muss noch ein paar Dinge erledigen',
			];
			const randomMessage = messages[Math.floor(Math.random() * messages.length)];
			message.inlineReply(randomMessage);
		}
		else if (message.content.toLowerCase().startsWith('was geht'.toLowerCase())) {
			const messages = [
				'Alles was Beine hat ' + pepeLaugh,
				'Alles was Beine hat ' + pepeLaugh,
				'Alles was Beine hat ' + pepeLaugh,
				'Alles was Beine hat ' + pepeLaugh,
				'Alles was Beine hat ' + pepeLaugh,
				'Alles was Beine hat ' + pepeLaugh,
				'Alles was Beine hat ' + pepeLaugh,
				'Alles was Beine hat ' + pepeLaugh,
				'Alles was Beine hat ' + pepeLaugh,
				'Alles was Bäume hat ' + pepeLaugh,
			];
			const randomMessage = messages[Math.floor(Math.random() * messages.length)];
			message.inlineReply(randomMessage);
		}
		const args3 = ['gute nacht', 'gude nacht', 'guna', 'gunnar'];
		if (args3.some(word => message.content.toLowerCase().startsWith(word.toLowerCase()))) {
			const messages = [
				'GuNa ' + peepoBye,
				`GUNAAAA ` + peepoBye,
				'Gute Nacht! ' + peepoBye,
				'Schlaf schön! 😴',
				'Süße Träume 🥰',
			];
			const randomMessage = messages[Math.floor(Math.random() * messages.length)];
			message.inlineReply(randomMessage);
		}
		const args4 = ['tschüss', 'bye', 'bis später', 'see ya'];
		if (args4.some(word => message.content.toLowerCase().startsWith(word.toLowerCase()))) {
			const messages = [
				'Bis später Peter!',
				'Bis Baldrian!',
				'Ciao Kakao!',
				'Auf Wiederzehn!',
				'Tschüsli-Müsli!',
				'Tschüssikowski!',
				'Tschö mit ö!',
				'see ya later...            ...*alligator* :sunglasses:',
			];
			const randomMessage = messages[Math.floor(Math.random() * messages.length)];
			message.inlineReply(randomMessage);
		}
		const args5 = ['pog', 'pag'];
		if (args5.some(word => message.content.toLowerCase().includes(word.toLowerCase()))) {
			const messages = [
				PogChamp,
				PagChomp,
				PagShake,
				PagMan,
				Pause,
				PauseChamp,
			];
			const randomMessage = messages[Math.floor(Math.random() * messages.length)];
			message.react(randomMessage);
		}
		else if (message.content.toLowerCase().includes('hug'.toLowerCase())) {
			const messages = [
				peepoHug,
				dankHug,
			];
			const randomMessage = messages[Math.floor(Math.random() * messages.length)];
			message.inlineReply(`${message.author} ${randomMessage}`);
		}

		if (message.author.id === '172002275412279296') {
			const args6 = [
				'you caught: 🐧', 'you caught: 🐢', 'you caught: 🐙', 'you caught: 🦑', 'you caught: 🦐', 'you caught: 🦀', 'you caught: 🐡', 'you caught: 🐬', 'you caught: 🐳', 'you caught: 🐋', 'you caught: 🦈', 'you caught: 🐊'];
			if (args6.some(ye => message.content.includes(ye))) {
				message.inlineReply(WEEWOO + ' Es wurde ein Rare gefangen!' + WEEWOO);
			}
		}
	},
};