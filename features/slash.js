module.exports.send = (client, interaction, embed, components, flags = 1) => {
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

module.exports.edit = (client, interaction, embed, components) => {
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

module.exports.error = (client, interaction, content) => {
    client.api.interactions(interaction.id, interaction.token).callback.post({
        data: {
            type: 4,
            data: {
                content,
                flags: 64,
            }
        }
    });
};

module.exports.get = (client, interaction) => {
    return client.api.webhooks(client.user.id, interaction.token).messages('@original').get();
}