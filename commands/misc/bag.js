const { MessageEmbed } = require("discord.js");
const { bags, rods, baits } = require('../games/fish.json');
const { setBag } = require('../../features/fishing');
const { getCoins, addCoins } = require('../../features/economy');
const profile = require('../../models/profile');

module.exports = {
    description: 'Öffnet deinen Rucksack',
    callback: async ({ client, interaction }) => {
        const guildId = interaction.guildID;
        const user = interaction.member.user;
        const userId = user.id; 
        const p_save = await profile.findOne({ userId });
        const credits = await getCoins(guildId, userId);

        const buttonSell = {
            type: 2,
            label: 'Fische verkaufen',
            style: 1,
            custom_id: 'sell',
        };

        const row = {
            type: 1,
            components: [ buttonSell ],
        };

        const embed = new MessageEmbed()
            .setAuthor(`${user.username}#${user.discriminator}`, `https://cdn.discordapp.com/avatars/${userId}/${user.avatar}.webp`)
            .setThumbnail('https://stardewvalleywiki.com/mediawiki/images/3/36/36_Backpack.png')
            .setColor('#945e1e')
            .setFooter('Azuma | Contact @florian#0002 for help', `https://cdn.discordapp.com/avatars/${client.user.id}/${client.user.avatar}.webp`);

        embed.addField('Credits', `${Intl.NumberFormat('de-DE', { maximumSignificantDigits: 10 }).format(credits)} 💵`);
        if (p_save && p_save.bag) {
            embed.setTitle(bags[p_save.bag].name);
            embed.setDescription('Du hast aktuell einen Rucksack mit ' + bags[p_save.bag].size + ' Plätzen.');
            if (p_save.rod) {
                const userRod = rods[p_save.rod];
                let percent = 0;
                if (userRod.no_bait == rods.rod_2.no_bait) percent = 5;
                if (userRod.no_bait == rods.rod_3.no_bait) percent = 10;
                if (userRod.no_bait == rods.rod_4.no_bait) percent = 15;
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
            embed.setTitle(bags.bag_1.name);
            embed.setDescription('Du hast aktuell einen Rucksack mit ' + bags.bag_1.size + ' Plätzen.')
        }
        
        if (p_save.bag_size && p_save.bag_size != 0) {
            interaction.reply({ embeds: [embed], components: [row] });
        }
        else {
            interaction.reply({ embeds: [embed] });
        };

        const message = await interaction.fetchReply();
        const filter = i => i.user.id == userId;

        const collector = message.createMessageComponentInteractionCollector(filter, { time: 300000 });

        collector.on('collect', async button => {
            if (button.customID == 'sell') {
                await profile.findOneAndUpdate(
                    { 
                        userId 
                    },
                    { 
                        userId,
                        bag_size: 0,
                        bag_value: 0,
                    }
                );
                await addCoins(guildId, userId, p_save.bag_value);
                buttonSell.disabled = true;
                buttonSell.style = 2;
                embed.addField('Erfolg!', `Du hast ${p_save.bag_size || 0} Fische verkauft und \`${p_save.bag_value || 0}\` 💵 verdient.`);
                button.update({ embeds: [embed], components: [row] });
            };
        });
    },
};