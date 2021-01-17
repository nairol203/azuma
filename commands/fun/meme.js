const got = require('got');
const Discord = require('discord.js');

module.exports = {
	callback: ({ message }) => {
		const embed = new Discord.MessageEmbed();
		got('https://www.reddit.com/r/memes/random/.json').then(response => {
			const content = JSON.parse(response.body);
			const permalink = content[0].data.children[0].data.permalink;
			const memeUrl = `https://reddit.com${permalink}`;
			const memeImage = content[0].data.children[0].data.url;
			const memeTitle = content[0].data.children[0].data.title;
			const memeUpvotes = content[0].data.children[0].data.ups;
			const memeNumComments = content[0].data.children[0].data.num_comments;
			embed.setTitle(`${memeTitle}`);
			embed.setURL(`${memeUrl}`);
			embed.setImage(memeImage);
			embed.setColor('RANDOM');
			embed.setFooter(`👍 ${memeUpvotes} 💬 ${memeNumComments}`);
			message.channel.send(embed);
		});
	},
};