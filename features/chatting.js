module.exports = client => {
	client.on('message', message => {
		if (message.author.bot) return;

		if (message.content.toLowerCase().startsWith('hi'.toLowerCase())) {
			const messages = [
				'Na du',
				'Hallo',
				'Moin Moin!',
				'<a:peepoHey:789156882404212808>',
				'GuMo',
				'Servus!',
				'Wie geht\'s? <a:peepoHey:789156882404212808>',
			];
			const randomMessage = messages[Math.floor(Math.random() * messages.length)];
			message.channel.send(randomMessage);
		}
		const args1 = ['hey', 'hallo', 'moin', 'servus', 'na du'];
		if (args1.some(word => message.content.toLowerCase().includes(word.toLowerCase()))) {
			const messages = [
				'Na du',
				'Hallo',
				'Moin Moin!',
				'<a:peepoHey:789156882404212808>',
				'GuMo',
				'Servus!',
				'Wie geht\'s? <a:peepoHey:789156882404212808>',
			];
			const randomMessage = messages[Math.floor(Math.random() * messages.length)];
			message.channel.send(randomMessage);
		}
		const args7 = ['guten morgen', 'guden morjen', 'gumo'];
		if (args7.some(word => message.content.toLowerCase().includes(word.toLowerCase()))) {
			const messages = [
				'GuMo <a:peepoHey:789156882404212808>',
				`${message.author} gumo <a:peepoHey:789156882404212808>`,
				'Guten Morgen! <a:peepoHey:789156882404212808>',
				'guten morgen! <a:peepoHey:789156882404212808>',
				'*gäääähhhhnnn* guten morgen!',
				'*gähhhn* moin!',
			];
			const randomMessage = messages[Math.floor(Math.random() * messages.length)];
			message.channel.send(randomMessage);
		}
		const args2 = ['alles gut', 'wie geht\'s', 'alles fit'];
		if (args2.some(word => message.content.toLowerCase().includes(word.toLowerCase()))) {
			const messages = [
				'Ganz okay',
				'Muss ja^^',
				'Gut, dir? <:FeelsOkayMan:743222752449790054>',
				'WH<:OMEGALUL:743222752839729225> ASKED?',
				'Könn\'t nicht besser sein!',
				'Gut, danke der Nachfrage',
				'Nicht so gut, hab heute n schlechten Tag <:Sadge:743222752756105269>',
				'mir gehts schaise <:FeelsBadMan:743222750197579856>',
				'Willst du wirklich gerade Smalltalk mit einem Discord-Bot führen??? <:WeirdChamp:798996992537001984>',
				'nett das du fragst <a:peepoShy:791825935862071338> mir gehts supi',
			];
			const randomMessage = messages[Math.floor(Math.random() * messages.length)];
			message.channel.send(randomMessage);
		}
		else if (message.content.toLowerCase().includes('was machst du'.toLowerCase())) {
			const messages = [
				'Mit 100 Leuten gleichzeitig schreiben <a:peepoChat:791826601888448533>',
				'Nichts, mir ist ziemlich langweilig <:peepoSad:761295891503120445>',
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
		else if (message.content.toLowerCase().includes('wie ist das wetter'.toLowerCase())) {
			message.channel.send('Schau doch aus dem Fenster <:FeelsDankMan:780215649384398908>');
		}
		else if (message.content.toLowerCase().includes('und sonst so'.toLowerCase())) {
			const messages = [
				'joa muss ja^^',
				'das übliche, muss noch ein paar Dinge erledigen',
			];
			const randomMessage = messages[Math.floor(Math.random() * messages.length)];
			message.channel.send(randomMessage);
		}
		else if (message.content.toLowerCase().includes('was geht'.toLowerCase())) {
			const messages = [
				'Alles was Beine hat <a:PepeLaugh:786266753726414848>',
				'Alles was Beine hat <a:PepeLaugh:786266753726414848>',
				'Alles was Beine hat <a:PepeLaugh:786266753726414848>',
				'Alles was Beine hat <a:PepeLaugh:786266753726414848>',
				'Alles was Beine hat <a:PepeLaugh:786266753726414848>',
				'Alles was Beine hat <a:PepeLaugh:786266753726414848>',
				'Alles was Beine hat <a:PepeLaugh:786266753726414848>',
				'Alles was Beine hat <a:PepeLaugh:786266753726414848>',
				'Alles was Beine hat <a:PepeLaugh:786266753726414848>',
				'Alles was Bäume hat <a:PepeLaugh:786266753726414848>',
			];
			const randomMessage = messages[Math.floor(Math.random() * messages.length)];
			message.channel.send(randomMessage);
		}
		const args3 = ['gute nacht', 'gude nacht', 'guna'];
		if (args3.some(word => message.content.toLowerCase().includes(word.toLowerCase()))) {
			const messages = [
				'GuNa <a:peepoHey:789156882404212808>',
				`${message.author} guna <a:peepoHey:789156882404212808>`,
				'Gute Nacht! <a:peepoHey:789156882404212808>',
				'gude nacht <a:peepoHey:789156882404212808>',
				'schlaf schön<:peepoBlanket:785509831548993566>',
				'süße träume <a:peepoShy:791825935862071338>',
			];
			const randomMessage = messages[Math.floor(Math.random() * messages.length)];
			message.channel.send(randomMessage);
		}
		const args4 = ['tschüss', 'bye', 'bis später', 'see ya'];
		if (args4.some(word => message.content.toLowerCase().includes(word.toLowerCase()))) {
			const messages = [
				'tschüss <a:peepoBye:791063849540649001>',
				'byeee <a:peepoBye:791063849540649001>',
				'<a:peepoBye:791063849540649001>',
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
				'<:PagChomp:798996992382468136>',
				'<:PagShake:798996992457179166>',
				'<:PauseChamp:798996992419954729>',
			];
			const randomMessage = messages[Math.floor(Math.random() * messages.length)];
			message.react(randomMessage);
		}
		else if (message.content.toLowerCase().includes('hug'.toLowerCase())) {
			const messages = [
				'<:peepoHug:750428178979225640>',
				'<:dankHug:791828072890368010>',
			];
			const randomMessage = messages[Math.floor(Math.random() * messages.length)];
			message.channel.send(`${message.author} ${randomMessage}`);
		}
	});

	client.on('message', message => {
		if (message.author.id === '172002275412279296') {
			const args6 = [
				'you caught: 🐧', 'you caught: 🐢', 'you caught: 🐙', 'you caught: 🦑', 'you caught: 🦐', 'you caught: 🦀', 'you caught: 🐡', 'you caught: 🐬', 'you caught: 🐳', 'you caught: 🐋', 'you caught: 🦈', 'you caught: 🐊'];
			if (args6.some(ye => message.content.includes(ye))) {
				message.channel.send('Glückwunsch zu deinem Rare!');
			}
		}
	});
};