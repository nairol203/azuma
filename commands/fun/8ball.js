module.exports = {
	slash: true,
	description: 'Stelle der Magischen Glaskugel eine Ja / Nein Frage',
	options: [
		{
			name: 'question',
			description: 'Frag etwas!',
			type: 3,
			required: true,
		}
	],
	callback: ({}) => {
		const messages = [
			'Definitiv ja.',
			'Auf keinen Fall!',
			'Ich bin mir unsicher!',
			'Darauf kannst du dich verlassen.',
			'Höchstwarscheinlich ja.',
			'Die Sterne deuten auf ja.',
			'Ohne Zweifel.',
			'Es sieht gut aus!',
			'Es ist so entschieden.',
			'Die Zeichen stehen schlecht.',
			'Meine Antwort ist nein.',
		];
		const randomMessage = messages[Math.floor(Math.random() * messages.length)];
		return randomMessage;
	},
};