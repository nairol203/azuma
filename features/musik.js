/* eslint-disable no-var */
module.exports = client => {
	const ytdl = require('ytdl-core');
	const Discord = require('discord.js');
	const YouTube = require('simple-youtube-api');
	const Util = require('discord.js');
	const youtube = new YouTube('AIzaSyB6QDXYXVDM-I7bwktzn6LOEn_71SubjHQ');
	const prefix = process.env.PREFIX;

	const queue = new Map();

	client.on('message', async message => {
		if (message.author.bot) return;

		const args = message.content.substring(prefix.length).split(' ');
		const searchString = args.slice(1).join(' ');
		const url = args[1] ? args[1].replace(/<(.+)>/g, '$1') : '';
		const serverQueue = queue.get(message.guild.id);

		if (message.content.startsWith(`${prefix}play`)) {
			const voiceChannel = message.member.voice.channel;
			if(!voiceChannel) return message.channel.send('<:no:767394810909949983> | Du musst in einem Sprachkanal sein um diesen Command zu benutzen!');
			const permissons = voiceChannel.permissionsFor(message.client.user);
			if(!permissons.has('CONNECT')) return message.channel.send('<:no:767394810909949983> | Ich habe keine Berechtigung deinem Sprachkanal beizutreten!');
			if(!permissons.has('SPEAK')) return message.channel.send('<:no:767394810909949983> | Ich kann in deinem Sprachkanal nicht sprechen!');

			if(url.match(/^https?:\/\/(www.youtube.com|youtube.com)\/playlist(.*)$/)) {
				const playList = await youtube.getPlaeaweaylist(url);
				const videos = await playList.getVideos();
				for (const video of Object.values(videos)) {
					const video2 = await youtube.getVideoByID(video.id);
					await handleVideo(video2, message, voiceChannel, true);
				}
				message.channel.send(`Playlist **${playList.title}** wurde zur Queue hinzugefügt.`);
				return undefined;
			}
			else {
				try {
					var video = await youtube.getVideoByID(url);
				}
				catch {
					try {
						var videos = await youtube.searchVideos(searchString, 1);
						// eslint-disable-next-line no-redeclare
						var video = await youtube.getVideoByID(videos[0].id);
					}
					catch {
						return message.channel.send('<:no:767394810909949983> | Ich konnte keine passenden Suchergebnisse finden.');
					}
				}
				return handleVideo(video, message, voiceChannel);
			}
		}
		else if (message.content.startsWith(`${prefix}search`)) {
			const voiceChannel = message.member.voice.channel;
			if(!voiceChannel) return message.channel.send('<:no:767394810909949983> | Du musst in einem Sprachkanal sein um diesen Command zu benutzen!');
			const permissons = voiceChannel.permissionsFor(message.client.user);
			if(!permissons.has('CONNECT')) return message.channel.send('<:no:767394810909949983> | Ich habe keine Berechtigung deinem Sprachkanal beizutreten!');
			if(!permissons.has('SPEAK')) return message.channel.send('<:no:767394810909949983> | Ich kann in deinem Sprachkanal nicht sprechen!');

			try {
				const videos1 = await youtube.searchVideos(searchString, 10);
				let index = 0;
				const embed = new Discord.MessageEmbed()
					.setTitle('Suchergebnisse:')
					.setDescription(`${videos1.map(video2 => `**${++index}.** ${video2.title}`).join('\n')}`)
					.setFooter('Bitte wähle einen Song von 1-10 aus.')
					.setColor('#fabe00');
				message.channel.send(embed);
				try {
					var responce = await message.channel.awaitMessages(msg => msg.content > 0 && msg.content < 11, {
						max: 1,
						time: 30000,
						errors: ['time'],
					});
				}
				catch {
					message.channel.send('<:no:767394810909949983> | Keine oder eine ungültige Eingabe erkannt.');
				}
				const videoIndex = parseInt(responce.first().content);
				// eslint-disable-next-line no-redeclare
				var video = await youtube.getVideoByID(videos[videoIndex - 1].id);
			}
			catch {
				return message.channel.send('<:no:767394810909949983> | Ich konnte keine passenden Suchergebnisse finden.');
			}
			return handleVideo(video, message, voiceChannel);
		}
		else if (message.content.startsWith(`${prefix}stop`)) {
			if(!message.member.voice.channel) return message.channel.send('<:no:767394810909949983> | Du musst in einem Sprachkanal sein um diesen Command zu benutzen!');
			if(!serverQueue) return message.channel.send('<:no:767394810909949983> | Es wird nichts gespielt');
			serverQueue.songs = [];
			serverQueue.connection.dispatcher.end();
			message.channel.send(':stop_button: | Die Musik wurde gestoppt.');
			return undefined;
		}
		else if (message.content.startsWith(`${prefix}skip`)) {
			if(!message.member.voice.channel) return message.channel.send('<:no:767394810909949983> | Du musst in einem Sprachkanal sein um diesen Command zu benutzen!');
			if(!serverQueue) return message.channel.send('<:no:767394810909949983> | Es wird gerade nichts gespielt.');
			serverQueue.connection.dispatcher.end();
			message.channel.send(':fast_forward: | Das Lied wurde übersprungen.');
		}
		else if (message.content.startsWith(`${prefix}volume`) || (message.content.startsWith(`${prefix}vol`))) {
			if(!message.member.voice.channel) return message.channel.send('<:no:767394810909949983> | Du musst in einem Sprachkanal sein um diesen Command zu benutzen!');
			if(!serverQueue) return message.channel.send('<:no:767394810909949983> | Es wird gerade nichts gespielt');
			if(!args[1]) return message.channel.send(`Die Lautstärke des Bot's ist **${serverQueue.volume}**.`);
			if(isNaN(args[1])) return message.channel.send('<:no:767394810909949983> | Keine gültige Eingabe erkannt.');
			serverQueue.volume = args[1];
			serverQueue.connection.dispatcher.setVolumeLogarithmic(args[1] / 5);
			message.channel.send(`Die Lautstärke wurde zu **${args[1]}** geändert.`);
		}
		else if (message.content.startsWith(`${prefix}nowplaying`) || (message.content.startsWith(`${prefix}np`))) {
			if(!serverQueue) return message.channel.send('<:no:767394810909949983> | Es wird gerade nichts gespielt.');
			message.channel.send(`:notes: | \`${serverQueue.songs[0].title}\` wird gespielt...`);
		}
		else if (message.content.startsWith(`${prefix}queue`)) {
			if(!serverQueue) return message.channel.send('<:no:767394810909949983> | Es wird gerade nichts gespielt.');
			message.channel.send(`
__**Song Queue:**__
${serverQueue.songs.map(song => `**-** \`${song.title}\``).join('\n')}

**Now Playing:** \`${serverQueue.songs[0].title}\`
		`, { split: true });
			return undefined;
		}
		else if (message.content.startsWith(`${prefix}pause`)) {
			if(!message.member.voice.channel) return message.channel.send('<:no:767394810909949983> | Du musst in einem Sprachkanal sein um diesen Command zu benutzen!');
			if(!serverQueue) return message.channel.send('<:no:767394810909949983> | Es wird gerade nichts gespielt');
			if(!serverQueue.playing) return message.channel.send('Die Musik ist schon pausiert.');
			serverQueue.playing = false;
			serverQueue.connection.dispatcher.pause();
			message.channel.send(':pause_button: | Die Musik wurde pausiert.');
			return undefined;
		}
		else if (message.content.startsWith(`${prefix}resume`)) {
			if(!message.member.voice.channel) return message.channel.send('<:no:767394810909949983> | Du musst in einem Sprachkanal sein um diesen Command zu benutzen!');
			if(!serverQueue) return message.channel.send('<:no:767394810909949983> | Es wird gerade nichts gespielt');
			if(serverQueue.playing) return message.channel.send('Die Musik ist nicht pausiert.');
			serverQueue.playing = true;
			serverQueue.connection.dispatcher.resume();
			message.channel.send(':play_pause: | Die Musik wird weiter abgespielt.');
			return undefined;
		}
		else if (message.content.startsWith(`${prefix}loop`)) {
			if(!message.member.voice.channel) return message.channel.send('<:no:767394810909949983> | Du musst in einem Sprachkanal sein um diesen Command zu benutzen!');
			if(!serverQueue) return message.channel.send('<:no:767394810909949983> | Es wird gerade nichts gespielt');

			serverQueue.loop = !serverQueue.loop;

			return message.channel.send(`:repeat_one: | Loop ist jetzt ${serverQueue.loop ? 'aktiviert' : 'deaktivert'}.`);
		}
		return undefined;
	});

	async function handleVideo(video, message, voiceChannel, playList = false) {
		const serverQueue = queue.get(message.guild.id);

		const song = {
			id: video.id,
			title: Util.escapeMarkdown(video.title),
			url: `https://www.youtube.com/watch?v=${video.id}`,
		};

		if(!serverQueue) {
			const queueConstruct = {
				textChannel: message.channel,
				voiceChannel: voiceChannel,
				connection: null,
				songs: [],
				volume: 1,
				playing: true,
				loop: false,
			};
			queue.set(message.guild.id, queueConstruct);
			queueConstruct.songs.push(song);

			try {
				const connection = await voiceChannel.join();
				queueConstruct.connection = connection;
				play(message.guild, queueConstruct.songs[0]);
			}
			catch (error) {
				console.log(`Error occured while connection to the voice channel: ${error}`);
				queue.delete(message.guild.id);
				return message.channel.send(`<:no:767394810909949983> | ${error}`);
			}
		}
		else {
			serverQueue.songs.push(song);
			if(playList) return undefined;
			return message.channel.send(`\`${song.title}\` wurde zur Queue hinzugefügt`);
		}
		return undefined;
	}
	function play(guild, song) {
		const serverQueue = queue.get(guild.id);

		if(!song) {
			serverQueue.voiceChannel.leave();
			queue.delete(guild.id);
			return;
		}
		const dispatcher = serverQueue.connection.play(ytdl(song.url))
			.on('finish', () => {
				if (!serverQueue.loop) serverQueue.songs.shift();
				play (guild, serverQueue.songs[0]);
			})
			.on('error', error => {
				console.log(error);
			});
		dispatcher.setVolumeLogarithmic(serverQueue.volume / 5);
		serverQueue.textChannel.send(`:notes: | \`${serverQueue.songs[0].title}\` wird gespielt...`);
	}
};

module.exports.config = {
	displayName: 'Musik',
	dbName: 'MUSIK',
};