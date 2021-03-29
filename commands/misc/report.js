module.exports = {
    description: 'Reporte einen Bug oder ein Servermitglied. Missbrauch wird bestraft!',
    options: [
        {
            name: 'options',
            description: 'Wähle eine Option!',
            type: 3,
            required: true,
            choices: [
                {
                    name: 'Bug',
                    value: 'Bug',
                },
                {
                    name: 'User',
                    value: 'User',
                },
            ],
        },
        {
            name: 'comment',
            description: 'Schreibe einen Kommentar zu dem Report!',
            type: 3,
            required: true,
        },
    ],
    callback: ({ client, args, interaction }) => {
        const user = interaction.member.user;
        const owner = client.users.cache.get('255739211112513536')
        const { options, comment } = args
        owner.send('<@' + user.id + '> hat einen '+ options +' reported: ' + comment)
        return 'Wir haben deinen Report erhalten!'
    }
}