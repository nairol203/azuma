const { PogChamp, PagChomp, PagShake, PagMan, Pause, PauseChamp, WeirdChamp, pepeLaugh, peepoHey, peepoBye, peepoHug, FeelsOkayNan, FeelsBadMan, dankHug } = require('../emoji.json');

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
				'GuMo',
				'Servus!',
				'Wie geht\'s? ' + peepoHey,
			];
			const randomMessage = messages[Math.floor(Math.random() * messages.length)];
			message.channel.send(randomMessage);
		}
		const args7 = ['guten morgen', 'guden morjen', 'gumo'];
		if (args7.some(word => message.content.toLowerCase().startsWith(word.toLowerCase()))) {
			const messages = [
				'GuMo ' + peepoHey,
				`${message.author} gumo ` + peepoHey,
				'Guten Morgen! ' + peepoHey,
				'guten morgen! ' + peepoHey,
				'*gäääähhhhnnn* guten morgen!',
				'*gähhhn* moin!',
			];
			const randomMessage = messages[Math.floor(Math.random() * messages.length)];
			message.channel.send(randomMessage);
		}
		const args2 = ['alles gut', 'wie geht', 'alles fit'];
		if (args2.some(word => message.content.toLowerCase().startsWith(word.toLowerCase()))) {
			const messages = [
				'Ganz okay',
				'Muss ja^^',
				'Gut, dir? ' + FeelsOkayNan,
				'WH<:OMEGALUL:743222752839729225> ASKED?',
				'Könn\'t nicht besser sein!',
				'Gut, danke der Nachfrage',
				'Nicht so gut, hab heute n schlechten Tag ' + FeelsBadMan,
				'mir gehts schaise ' + FeelsBadMan,
				'Willst du wirklich gerade Smalltalk mit einem Discord-Bot führen??? ' + WeirdChamp,
				'nett das du fragst <a:peepoShy:791825935862071338> mir gehts supi',
			];
			const randomMessage = messages[Math.floor(Math.random() * messages.length)];
			message.channel.send(randomMessage);
		}
		else if (message.content.toLowerCase().startsWith('was machst du'.toLowerCase())) {
			const messages = [
				'Mit 100 Leuten gleichzeitig schreiben <a:peepoChat:791826601888448533>',
				'Nichts, mir ist ziemlich langweilig ' + FeelsBadMan,
				'Darf ich nicht sagen :zipper_mouth:',
				'<:MonkaLaugh:791062220653723661> Sportwetten',
				'FORTNITE SPIELEN <:POGGERS:743222753066483883>',
				'Ein paar 90\'s cranken <:POGGERS:743222753066483883>',
				'Hör auf mit mir zu reden!!!! <:PepeRage:743222752714162226> <:PepeRage:743222752714162226> <:PepeRage:743222752714162226>',
				'Mit dir schreiben <a:peepoChat:791826601888448533>',
				'Mit dir schreiben <a:peepoShy:791825935862071338>',
			];
			const randomMessage = messages[Math.floor(Math.random() * messages.length)];
			message.channel.send(randomMessage);
		}
		else if (message.content.toLowerCase().startsWith('wie ist das wetter'.toLowerCase())) {
			message.channel.send('Schau doch aus dem Fenster <:FeelsDankMan:780215649384398908>');
		}
		else if (message.content.toLowerCase().startsWith('und sonst so'.toLowerCase())) {
			const messages = [
				'joa muss ja^^',
				'das übliche, muss noch ein paar Dinge erledigen',
			];
			const randomMessage = messages[Math.floor(Math.random() * messages.length)];
			message.channel.send(randomMessage);
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
			message.channel.send(randomMessage);
		}
		const args3 = ['gute nacht', 'gude nacht', 'guna'];
		if (args3.some(word => message.content.toLowerCase().startsWith(word.toLowerCase()))) {
			const messages = [
				'GuNa ' + peepoBye,
				`${message.author} guna ` + peepoBye,
				'Gute Nacht! ' + peepoBye,
				'gude nacht ' + peepoBye,
				'schlaf schön <:peepoBlanket:785509831548993566>',
				'süße träume <a:peepoShy:791825935862071338>',
			];
			const randomMessage = messages[Math.floor(Math.random() * messages.length)];
			message.channel.send(randomMessage);
		}
		const args4 = ['tschüss', 'bye', 'bis später', 'see ya'];
		if (args4.some(word => message.content.toLowerCase().startsWith(word.toLowerCase()))) {
			const messages = [
				'tschüss ' + peepoBye,
				'byeee ' + peepoBye,
				peepoBye,
				'bis später!',
				'see ya later',
				'see ya later...               ...*alligator* :sunglasses:',
			];
			const randomMessage = messages[Math.floor(Math.random() * messages.length)];
			message.channel.send(randomMessage);
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
			message.channel.send(`${message.author} ${randomMessage}`);
		}

		if (message.author.id === '172002275412279296') {
			const args6 = [
				'you caught: 🐧', 'you caught: 🐢', 'you caught: 🐙', 'you caught: 🦑', 'you caught: 🦐', 'you caught: 🦀', 'you caught: 🐡', 'you caught: 🐬', 'you caught: 🐳', 'you caught: 🐋', 'you caught: 🦈', 'you caught: 🐊'];
			if (args6.some(ye => message.content.includes(ye))) {
				message.channel.send('Glückwunsch zu deinem Rare!');
			}
		}
	},
};