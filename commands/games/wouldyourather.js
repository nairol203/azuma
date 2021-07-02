const { MessageButton, MessageActionRow } = require('discord.js');
const fetch = require('node-fetch');

module.exports = {
    description: 'Würdest du eher? Mit Prozentzahlen basierend auf vorherigen Spielern',
    callback: async ({ interaction }) => {
        await interaction.defer();

        const res = await fetch(`https://api.tovade.xyz/v1/fun/wyr`).then((re) => re.json());

        let style1 = 'PRIMARY';
        let style2 = 'PRIMARY';

        let row = new MessageActionRow()
            .addComponents(
                new MessageButton()
                    .setCustomID('wyr1')
                    .setLabel(`${res.questions[0]}`)
                    .setStyle(style1),
                new MessageButton()
                    .setCustomID('wyr2')
                    .setLabel(`${res.questions[1]}`)
                    .setStyle(style2),
            );

        await interaction.editReply({ content: '**Würdest du eher**', components: [ row ] });

        const message = await interaction.fetchReply();
        const filter = i => i.user.id == interaction.member.user.id;
        const collector = message.createMessageComponentInteractionCollector(filter, { time: 300000 });

        collector.on('collect', async button => {
            if (button.customID == 'wyr1') {
                style2 = 'SECONDARY';
                row = new MessageActionRow()
                    .addComponents(
                        new MessageButton()
                            .setCustomID('wyr1')
                            .setLabel(`${res.questions[0]}` + ` (${res.percentage["1"]}%)`)
                            .setStyle(style1)
                            .setDisabled(true),
                        new MessageButton()
                            .setCustomID('wyr2')
                            .setLabel(`${res.questions[1]}` + ` (${res.percentage["2"]}%)`)
                            .setStyle(style2)
                            .setDisabled(true),
                    );
                collector.stop();
                await button.update({ components: [ row ] });
            }
            else if (button.customID == 'wyr2') {
                style1 = 'SECONDARY';
                row = new MessageActionRow()
                    .addComponents(
                        new MessageButton()
                            .setCustomID('wyr1')
                            .setLabel(`${res.questions[0]}` + ` (${res.percentage["1"]}%)`)
                            .setStyle(style1)
                            .setDisabled(true),
                        new MessageButton()
                            .setCustomID('wyr2')
                            .setLabel(`${res.questions[1]}` + ` (${res.percentage["2"]}%)`)
                            .setStyle(style2)
                            .setDisabled(true),
                    );
                collector.stop();
                await button.update({ components: [ row ] });
            };
        });
    },
};