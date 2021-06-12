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
                flags: flags,
            },
        },
    });
};

module.exports.edit = (client, interaction, embed, components, content) => {
    let data = {};
    if (content) data.content = content;
    if (embed) data.embeds = [embed];
    if (components) data.components = [components];
    client.api.webhooks(client.user.id, interaction.token).messages('@original').patch({
        data,
    });
};

module.exports.error = (client, interaction, content, embed, row, flags = 64) => {
    let data = {};
    if (content) data.content = content;
    if (embed) data.embeds = [embed];
    if (row) data.components = [row];
    if (flags) data.flags = flags;
    client.api.interactions(interaction.id, interaction.token).callback.post({
        data: {
            type: 4,
            data,
        }
    });
};

module.exports.get = (client, interaction) => {
    return client.api.webhooks(client.user.id, interaction.token).messages('@original').get().catch(e =>  console.log(e));
}