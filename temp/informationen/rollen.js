module.exports = {
	testOnly: true,
	callback: ({ message }) => {
		const Discord = require('discord.js');
		const embed = new Discord.MessageEmbed()
			.setColor('#f77600')
			.setTitle('Rollenübersicht')
			.setDescription('• Rollen mit Vorteilen:\n- <@&331499990788866049> - Adminrechte\n- <@&650071293550395405> - Zugriff auf `Talk @VIP`, Berechtigung in <#508421018558398468> zu schreiben\n- <@&296720195202842635> - Zugriff auf `Talk @VIP`, Berechtigung in <#508421018558398468> zu schreiben\n- <@&770782137338036265> - In der rechten Anzeige als <@&770782137338036265> gruppieren\n- <@&772528556978864178> - Zugriff auf <#772528499864502272>\n- <@&770782863515189260> - Zugriff auf <#763067361334919199>\n\n• Rollen mit Beschränkungen:\n- <@&707606601225207868> - Nur Zugriff auf die `Admin-Area` und alle Sprach-Kanäle (außer Private Sprach-Kanäle)\n- <@&770785336829018164> - Nur Zugriff auf die `Admin-Area`, auf <#358773353995042819> und alle Sprach-Kanäle (außer Private Sprach-Kanäle)\n\n• Kosmetische Rollen:\n- <@&632336529766875155> , Alle Angelrollen, Alle Levelrollen')
			.setFooter('Stand 30.10.2020');
		return message.channel.send(embed);
	},
};