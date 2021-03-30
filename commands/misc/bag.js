const { MessageEmbed } = require("discord.js");
const { bags, rods, baits } = require('../games/fish.json');
const { setBag } = require('../../features/fishing');
const { getCoins } = require('../../features/economy');
const profile = require('../../models/profile');

module.exports = {
    description: 'Öffnet deinen Rucksack',
    callback: async ({ interaction }) => {
        const guildId = interaction.guild_id;
        const user = interaction.member.user;
        const userId = user.id; 
        const p_save = await profile.findOne({ userId });
        const credits = await getCoins(guildId, userId);

        const embed = new MessageEmbed()
            .setThumbnail('https://stardewvalleywiki.com/mediawiki/images/3/36/36_Backpack.png')
            .setColor('#945e1e');

        embed.addField('Credits', `${credits} 💵`);
        if (p_save && p_save.bag) {
            embed.setTitle(user.username + '\'s ' + bags[p_save.bag].name);
            embed.setDescription('Du hast aktuell einen Rucksack mit ' + bags[p_save.bag].size + ' Plätzen.');
            if (p_save.rod) {
                const userRod = rods[p_save.rod];
                let percent = 0;
                if (userRod.no_bait == 0.15) percent = 15;
                if (userRod.no_bait == 0.3) percent = 30;
                if (userRod.no_bait == 0.5) percent = 50;
                embed.addField(`🎣 Angel: ${userRod.name}`, `- Angel-Cooldown: ${userRod.cooldown} Sekunden\n- Chance keine Köder zu verbrauchen: ${percent}%`);
            }
            if (p_save.bag_size && p_save.bag_size != 0) {
                embed.addField('🐟 Fische', `- ${p_save.bag_size} Fische\n- ${p_save.bag_value || 0} 💵`);
            }
            if ((p_save.bait_1 && p_save.bait_1 != 0 )|| (p_save.bait_2 && p_save.bait_2 != 0) || (p_save.bait_3 && p_save.bait_3 != 0)) {
                embed.addField('🐚 Köder', `- ${p_save.bait_1 || 0}x ${baits.bait_1.name}\n- ${p_save.bait_2 || 0}x ${baits.bait_2.name}\n- ${p_save.bait_3 || 0}x ${baits.bait_3.name}`);
            }
        } else {
            await setBag(userId, 'bag_1');
            embed.setTitle(user.username + '\'s ' + bags.bag_1.name);
            embed.setDescription('Du hast aktuell einen Rucksack mit ' + bags.bag_1.size + ' Plätzen.')
        }
        return embed;
    }
}