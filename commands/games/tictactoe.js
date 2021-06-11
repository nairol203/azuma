const { error, get } = require('../../features/slash');

const midDuel = new Set;

module.exports = {
    description: 'Spiele TicTacToe mit einem anderen User',
    options: [
        {
            name: 'user',
            description: 'Den User mit dem du spielen möchtest',
            type: 6,
            required: true,
        },
    ],
    callback: async ({ client, interaction, args }) => {
        const userId = interaction.member.user.id;
        const user = client.users.cache.get(userId);
        const targetId = args.user;
        const target = client.users.cache.get(targetId);

        if (target.bot) return error(client, interaction, 'Du kannst nicht mit einem Bot spielen!');
        else if (userId == targetId) return error(client, interaction, 'Du kannst nicht mit dir selbst spielen!');
        else if (midDuel.has(userId)) return error(client, interaction, 'Du bist aktuell schon in einem Spiel!');
        else if (midDuel.has(targetId)) return error(client, interaction, `${target.username} ist aktuell schon in einem Spiel!`);

        function getRandomString(length) {
            let randomChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
            let result;
            for ( let i = 0; i < length; i++ ) {
                result += randomChars.charAt(Math.floor(Math.random() * randomChars.length))
            }
            return result;
        };

        let a11 = (getRandomString(4)+'-'+getRandomString(4)+'-'+getRandomString(4)+'-'+getRandomString(4))
        let a22 = (getRandomString(4)+'-'+getRandomString(4)+'-'+getRandomString(4)+'-'+getRandomString(4))
        let a33 = (getRandomString(4)+'-'+getRandomString(4)+'-'+getRandomString(4)+'-'+getRandomString(4))
        let b11 = (getRandomString(4)+'-'+getRandomString(4)+'-'+getRandomString(4)+'-'+getRandomString(4))
        let b22 = (getRandomString(4)+'-'+getRandomString(4)+'-'+getRandomString(4)+'-'+getRandomString(4))
        let b33 = (getRandomString(4)+'-'+getRandomString(4)+'-'+getRandomString(4)+'-'+getRandomString(4))
        let c11 = (getRandomString(4)+'-'+getRandomString(4)+'-'+getRandomString(4)+'-'+getRandomString(4))
        let c22 = (getRandomString(4)+'-'+getRandomString(4)+'-'+getRandomString(4)+'-'+getRandomString(4))
        let c33 = (getRandomString(4)+'-'+getRandomString(4)+'-'+getRandomString(4)+'-'+getRandomString(4))

        const gameData = [
            { member: user, style: 3, em: '🟢' },
            { member: target, style: 4, em: '🔴' },
        ];

        let a1; let a2; let a3;
        let b1; let b2; let b3;
        let c1; let c2; let c3;

        const A1 = {
            type: 2,
            label: ' ',
            style: 2,
            custom_id: a11,
        };
        const A2 = {
            type: 2,
            label: ' ',
            style: 2,
            custom_id: a22,
        };
        const A3 = {
            type: 2,
            label: ' ',
            style: 2,
            custom_id: a33,
        };
        const B1 = {
            type: 2,
            label: ' ',
            style: 2,
            custom_id: b11,
        };
        const B2 = {
            type: 2,
            label: ' ',
            style: 2,
            custom_id: b22,
        };
        const B3 = {
            type: 2,
            label: ' ',
            style: 2,
            custom_id: b33,
        };
        const C1 = {
            type: 2,
            label: ' ',
            style: 2,
            custom_id: c11,
        };
        const C2 = {
            type: 2,
            label: ' ',
            style: 2,
            custom_id: c22,
        };
        const C3 = {
            type: 2,
            label: ' ',
            style: 2,
            custom_id: c33,
        };

        const components = [
            {
                type: 1,
                components: [ A1, A2, A3 ],
            },
            {
                type: 1,
                components: [ B1, B2, B3 ],
            },
            {
                type: 1,
                components: [ C1, C2, C3 ],
            },
        ]

        let player = 0;

        client.api.interactions(interaction.id, interaction.token).callback.post({
            data: {
                type: 4,
                data: {
                    content: `**__TicTacToe__**\n${gameData[0].member} vs. ${gameData[1].member}\n\n${gameData[player].member} ist am Zug.`,
                    components,
                },
            },
        });
        
        midDuel.add(userId)
        midDuel.add(targetId)

        const response = await get(client, interaction);

        client.on('clickButton', async button => {
            if (response.id !== button.message.id) return;
            if (button.clicker.user.id !== gameData[player].member.id) return;

            button.defer();

            if (button.id == a11 && gameData[player].member.id == button.clicker.user.id) {
                if (button.style == gameData[player].style) return;
                a1 = gameData[player].style;
                A1.style = gameData[player].style;
                A1.disabled = true;
                edit();
                await checkWinner();
                player = (player + 1) % 2;
            }
            else if (button.id == a22 && gameData[player].member.id == button.clicker.user.id) {
                if (button.style == gameData[player].style) return;
                a2 = gameData[player].style;
                A2.style = gameData[player].style;
                A2.disabled = true;
                edit();
                await checkWinner();
                player = (player + 1) % 2;
            }
            else if (button.id == a33 && gameData[player].member.id == button.clicker.user.id) {
                if (button.style == gameData[player].style) return;
                a3 = gameData[player].style;
                A3.style = gameData[player].style;
                A3.disabled = true;
                edit();
                await checkWinner();
                player = (player + 1) % 2;
            }
            else if (button.id == b11 && gameData[player].member.id == button.clicker.user.id) {
                if (button.style == gameData[player].style) return;
                b1 = gameData[player].style;
                B1.style = gameData[player].style;
                B1.disabled = true;
                edit();
                await checkWinner();
                player = (player + 1) % 2;
            }
            else if (button.id == b22 && gameData[player].member.id == button.clicker.user.id) {
                if (button.style == gameData[player].style) return;
                b2 = gameData[player].style;
                B2.style = gameData[player].style;
                B2.disabled = true;
                edit();
                await checkWinner();
                player = (player + 1) % 2;
            }
            else if (button.id == b33 && gameData[player].member.id == button.clicker.user.id) {
                if (button.style == gameData[player].style) return;
                b3 = gameData[player].style;
                B3.style = gameData[player].style;
                B3.disabled = true;
                edit();
                await checkWinner();
                player = (player + 1) % 2;  

            }
            else if (button.id == c11 && gameData[player].member.id == button.clicker.user.id) {
                if (button.style == gameData[player].style) return;
                c1 = gameData[player].style;
                C1.style = gameData[player].style;
                C1.disabled = true;
                edit();
                await checkWinner();
                player = (player + 1) % 2;
            }
            else if (button.id == c22 && gameData[player].member.id == button.clicker.user.id) {
                if (button.style == gameData[player].style) return;
                c2 = gameData[player].style;
                C2.style = gameData[player].style;
                C2.disabled = true;
                edit();
                await checkWinner();
                player = (player + 1) % 2;
            }
            else if (button.id == c33 && gameData[player].member.id == button.clicker.user.id) {
                if (button.style == gameData[player].style) return;
                c3 = gameData[player].style;
                C3.style = gameData[player].style;
                C3.disabled = true;
                edit();
                await checkWinner();
                player = (player + 1) % 2;
            };
        });
        
        function edit() {
            console.log(response.id, userId, targetId)
            client.api.webhooks(client.user.id, interaction.token).messages('@original').patch({
                data: {
                    content: `**__TicTacToe__**\n${gameData[0].member} vs. ${gameData[1].member}\n\n${gameData[(player + 1) % 2].member} ist am Zug.`,
                    components,
                },
            });
        };

        async function checkWinner() {
            if (a1 == 3 && b1 == 3 && c1 == 3 || a1 == 4 && b1 == 4 && c1 == 4) {
                await stop();
            } else if (a2 == 3 && b2 == 3 && c2 == 3 || a2 == 4 && b2 == 4 && c2 == 4) {
                await stop();
            } else if (a3 == 3 && b3 == 3 && c3 == 3 || a3 == 4 && b3 == 4 && c3 == 4) {
                await stop();
            } else if (a1 == 3 && a2 == 3 && a3 == 3 || a1 == 4 && a2 == 4 && a3 == 4) {
                await stop();
            } else if (b1 == 3 && b2 == 3 && b3 == 3 || b1 == 4 && b2 == 4 && b3 == 4) {
                await stop();
            } else if (c1 == 3 && c2 == 3 && c3 == 3 || c1 == 4 && c2 == 4 && c3 == 4) {
                await stop();
            } else if (a1 == 3 && b2 == 3 && c3 == 3 || a1 == 4 && b2 == 4 && c3 == 4) {
                await stop();
            } else if (a3 == 3 && b2 == 3 && c1 == 3 || a3 == 4 && b2 == 4 && c1 == 4) {
                await stop();
            } else if (a1 && a2 && a3 && b1 && b2 && b3 && c1 && c2 && c3) {
                midDuel.delete(userId)
                midDuel.delete(targetId)
    
                client.api.webhooks(client.user.id, interaction.token).messages('@original').patch({
                    data: {
                        content: `**__TicTacToe__**\n${gameData[0].member} vs. ${gameData[1].member}\n\nUnentschieden!`,
                    },
                    components,
                });
            };
        };

        function stop() {
            midDuel.delete(userId)
            midDuel.delete(targetId)

            A1.disabled = true; A2.disabled = true; A3.disabled = true;
            B1.disabled = true; B2.disabled = true; B3.disabled = true;
            C1.disabled = true; C2.disabled = true; C3.disabled = true;

            client.api.webhooks(client.user.id, interaction.token).messages('@original').patch({
                data: {
                    content: `**__TicTacToe__**\n${gameData[0].member} vs. ${gameData[1].member}\n\n${gameData[player].member} gewinnt!`,
                },
                components,
            });
        };
    },
};