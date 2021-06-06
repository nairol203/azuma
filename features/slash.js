module.exports.send = async (client, interaction, embed, components, flags = 1) => {
    client.api.interactions(interaction.id, interaction.token).callback.post({
        data: {
            type: 4,
            data: {
                embeds: [
                    embed,
                ],
                components: [
                    components,
                ],
            },
            flags: flags,
        },
    });
};

module.exports.edit = async (client, interaction, embed, components) => {
    client.api.webhooks(client.user.id, interaction.token).messages('@original').patch({
        data: {
            embeds: [
                embed,
            ],
            components: [
                components,
            ],
        },
    });
};