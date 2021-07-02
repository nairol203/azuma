const { MessageButton, MessageActionRow } = require('discord.js');
const fetch = require('node-fetch');

module.exports = {
    update: true,
    description: 'Würdest du eher? Mit Prozentzahlen basierend auf vorherigen Spielern',
    callback: async ({ interaction }) => {
        await interaction.defer();

        const res = await fetch(`https://api.tovade.xyz/v1/fun/wyr`).then((re) => re.json());

        let row = new MessageActionRow()
            .addComponents(
                new MessageButton()
                    .setCustomID('wyr1')
                    .setLabel(`${res.questions[0]}`)
                    .setStyle('PRIMARY'),
                new MessageButton()
                    .setCustomID('wyr2')
                    .setLabel(`${res.questions[1]}`)
                    .setStyle('PRIMARY'),
            );

        await interaction.reply({ content: '**Würdest du eher**', components: [ row ] });

        const message = await interaction.fetchReply();
        const filter = i => i.user.id == interaction.member.user.id;
        const collector = message.createMessageComponentInteractionCollector(filter, { time: 300000 });

        let style1; let style2;

        collector.on('collect', async button => {
            if (button.customID == 'wyr1') {
                style1 = 'PRIMARY';
                style2 = 'SECONDARY';
                collector.stop();
            }
            else if (button.customID == 'wyr2') {
                style1 = 'SECONDARY';
                style2 = 'PRIMARY';
                collector.stop();
            };
        });

        collector.on('end', () => {
            row = new MessageActionRow()
                .addComponents(
                    new MessageButton()
                        .setCustomID(id1)
                        .setLabel(`${res.questions[0]}` + ` (${res.percentage["1"]}%)`)
                        .setStyle(style1)
                        .setDisabled(true),
                    new MessageButton()
                        .setCustomID(id2)
                        .setLabel(`${res.questions[1]}` + ` (${res.percentage["2"]}%)`)
                        .setStyle(style2)
                        .setDisabled(true),
                );
            await interaction.editReply({ components: [ row ] });
        });
    },
};