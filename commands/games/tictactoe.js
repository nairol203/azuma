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
        const user = client.users.cache.get(interaction.member.user.id);
        const target = client.users.cache.get(args.user);

        if (target.bot) return error(client, interaction, 'Du kannst nicht mit einem Bot spielen!');
        else if (user.id == target.id) return error(client, interaction, 'Du kannst nicht mit dir selbst spielen!');
        else if (midDuel.has(user.id)) return error(client, interaction, 'Du bist aktuell schon in einem Spiel!');
        else if (midDuel.has(target.id)) return error(client, interaction, `${target.username} ist aktuell schon in einem Spiel!`);

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
            custom_id: 'a1',
        };
        const A2 = {
            type: 2,
            label: ' ',
            style: 2,
            custom_id: 'a2',
        };
        const A3 = {
            type: 2,
            label: ' ',
            style: 2,
            custom_id: 'a3',
        };
        const B1 = {
            type: 2,
            label: ' ',
            style: 2,
            custom_id: 'b1',
        };
        const B2 = {
            type: 2,
            label: ' ',
            style: 2,
            custom_id: 'b2',
        };
        const B3 = {
            type: 2,
            label: ' ',
            style: 2,
            custom_id: 'b3',
        };
        const C1 = {
            type: 2,
            label: ' ',
            style: 2,
            custom_id: 'c1',
        };
        const C2 = {
            type: 2,
            label: ' ',
            style: 2,
            custom_id: 'c2',
        };
        const C3 = {
            type: 2,
            label: ' ',
            style: 2,
            custom_id: 'c3',
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
        
        midDuel.add(user.id);
        midDuel.add(target.id);

        const response = await get(client, interaction);

        client.on('clickButton', async button => {
            if (response.id !== button.message.id) return;
            if (button.clicker.user.id !== gameData[player].member.id) return;

            button.defer();

            if (button.id == 'a1' && gameData[player].member.id == button.clicker.user.id) {
                if (button.style == gameData[player].style) return;
                a1 = gameData[player].style;
                A1.style = gameData[player].style;
                A1.disabled = true;
                edit();
                await checkWinner();
                player = (player + 1) % 2;
            }
            else if (button.id == 'a2' && gameData[player].member.id == button.clicker.user.id) {
                if (button.style == gameData[player].style) return;
                a2 = gameData[player].style;
                A2.style = gameData[player].style;
                A2.disabled = true;
                edit();
                await checkWinner();
                player = (player + 1) % 2;
            }
            else if (button.id == 'a3' && gameData[player].member.id == button.clicker.user.id) {
                if (button.style == gameData[player].style) return;
                a3 = gameData[player].style;
                A3.style = gameData[player].style;
                A3.disabled = true;
                edit();
                await checkWinner();
                player = (player + 1) % 2;
            }
            else if (button.id == 'b1' && gameData[player].member.id == button.clicker.user.id) {
                if (button.style == gameData[player].style) return;
                b1 = gameData[player].style;
                B1.style = gameData[player].style;
                B1.disabled = true;
                edit();
                await checkWinner();
                player = (player + 1) % 2;
            }
            else if (button.id == 'b2' && gameData[player].member.id == button.clicker.user.id) {
                if (button.style == gameData[player].style) return;
                b2 = gameData[player].style;
                B2.style = gameData[player].style;
                B2.disabled = true;
                edit();
                await checkWinner();
                player = (player + 1) % 2;
            }
            else if (button.id == 'b3' && gameData[player].member.id == button.clicker.user.id) {
                if (button.style == gameData[player].style) return;
                b3 = gameData[player].style;
                B3.style = gameData[player].style;
                B3.disabled = true;
                edit();
                await checkWinner();
                player = (player + 1) % 2;  

            }
            else if (button.id == 'c1' && gameData[player].member.id == button.clicker.user.id) {
                if (button.style == gameData[player].style) return;
                c1 = gameData[player].style;
                C1.style = gameData[player].style;
                C1.disabled = true;
                edit();
                await checkWinner();
                player = (player + 1) % 2;
            }
            else if (button.id == 'c2' && gameData[player].member.id == button.clicker.user.id) {
                if (button.style == gameData[player].style) return;
                c2 = gameData[player].style;
                C2.style = gameData[player].style;
                C2.disabled = true;
                edit();
                await checkWinner();
                player = (player + 1) % 2;
            }
            else if (button.id == 'c3' && gameData[player].member.id == button.clicker.user.id) {
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
                midDuel.delete(user.id);
                midDuel.delete(target.id);
    
                client.api.webhooks(client.user.id, interaction.token).messages('@original').patch({
                    data: {
                        content: `**__TicTacToe__**\n${gameData[0].member} vs. ${gameData[1].member}\n\nUnentschieden!`,
                    },
                    components,
                });
            };
        };

        function stop() {
            midDuel.delete(user.id);
            midDuel.delete(target.id);

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