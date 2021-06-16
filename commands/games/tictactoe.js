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
        const target = interaction.options.get('user').user;

        if (target.bot) return interaction.reply({ content: 'Du bist ein paar Jahrzehnte zu früh, Bots können sowas noch nicht!', ephemeral: true });
        else if (user.id == target.id) return interaction.reply({ content: 'Wie willst du denn mit dir selbst spielen??', ephemeral: true });
        else if (midDuel.has(user.id)) return interaction.reply({ content: 'Du spielst doch gerade schon eine Runde!?', ephemeral: true });
        else if (midDuel.has(target.id)) return interaction.reply({ content: `${target.username} spielt schon eine Runde. Das sollen Freunde sein...`, ephemeral: true });

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

        const row1 = {
            type: 1,
            components: [ A1, A2, A3 ],
        };
        const row2 = {
            type: 1,
            components: [ B1, B2, B3 ],
        };
        const row3 = {
            type: 1,
            components: [ C1, C2, C3 ],
        };

        let player = 0;

        interaction.reply({ content: `**__TicTacToe__**\n${gameData[0].member} vs. ${gameData[1].member}\n\n${gameData[player].member} ist am Zug.`, components: [row1, row2, row3] });
        
        midDuel.add(user.id);
        midDuel.add(target.id);

        const message = await interaction.fetchReply()
        const filter = i => i.user.id == gameData[player].member.id;

        const collector = message.createMessageComponentInteractionCollector(filter, { time: 300000 });

        collector.on('collect', async button => {
            if (button.customID == 'a1' && gameData[player].member.id == button.user.id) {
                if (button.style == gameData[player].style) return;
                a1 = gameData[player].style;
                A1.style = gameData[player].style;
                A1.disabled = true;
                button.update({ content: `**__TicTacToe__**\n${gameData[0].member} vs. ${gameData[1].member}\n\n${gameData[player].member} ist am Zug.`, components: [row1, row2, row3] });
                await checkWinner();
                player = (player + 1) % 2;
            }
            else if (button.customID == 'a2' && gameData[player].member.id == button.user.id) {
                if (button.style == gameData[player].style) return;
                a2 = gameData[player].style;
                A2.style = gameData[player].style;
                A2.disabled = true;
                button.update({ content: `**__TicTacToe__**\n${gameData[0].member} vs. ${gameData[1].member}\n\n${gameData[player].member} ist am Zug.`, components: [row1, row2, row3] });
                await checkWinner();
                player = (player + 1) % 2;
            }
            else if (button.customID == 'a3' && gameData[player].member.id == button.user.id) {
                if (button.style == gameData[player].style) return;
                a3 = gameData[player].style;
                A3.style = gameData[player].style;
                A3.disabled = true;
                button.update({ content: `**__TicTacToe__**\n${gameData[0].member} vs. ${gameData[1].member}\n\n${gameData[player].member} ist am Zug.`, components: [row1, row2, row3] });
                await checkWinner();
                player = (player + 1) % 2;
            }
            else if (button.customID == 'b1' && gameData[player].member.id == button.user.id) {
                if (button.style == gameData[player].style) return;
                b1 = gameData[player].style;
                B1.style = gameData[player].style;
                B1.disabled = true;
                button.update({ content: `**__TicTacToe__**\n${gameData[0].member} vs. ${gameData[1].member}\n\n${gameData[player].member} ist am Zug.`, components: [row1, row2, row3] });
                await checkWinner();
                player = (player + 1) % 2;
            }
            else if (button.customID == 'b2' && gameData[player].member.id == button.user.id) {
                if (button.style == gameData[player].style) return;
                b2 = gameData[player].style;
                B2.style = gameData[player].style;
                B2.disabled = true;
                button.update({ content: `**__TicTacToe__**\n${gameData[0].member} vs. ${gameData[1].member}\n\n${gameData[player].member} ist am Zug.`, components: [row1, row2, row3] });
                await checkWinner();
                player = (player + 1) % 2;
            }
            else if (button.customID == 'b3' && gameData[player].member.id == button.user.id) {
                if (button.style == gameData[player].style) return;
                b3 = gameData[player].style;
                B3.style = gameData[player].style;
                B3.disabled = true;
                button.update({ content: `**__TicTacToe__**\n${gameData[0].member} vs. ${gameData[1].member}\n\n${gameData[player].member} ist am Zug.`, components: [row1, row2, row3] });
                await checkWinner();
                player = (player + 1) % 2;  

            }
            else if (button.customID == 'c1' && gameData[player].member.id == button.user.id) {
                if (button.style == gameData[player].style) return;
                c1 = gameData[player].style;
                C1.style = gameData[player].style;
                C1.disabled = true;
                button.update({ content: `**__TicTacToe__**\n${gameData[0].member} vs. ${gameData[1].member}\n\n${gameData[player].member} ist am Zug.`, components: [row1, row2, row3] });
                await checkWinner();
                player = (player + 1) % 2;
            }
            else if (button.customID == 'c2' && gameData[player].member.id == button.user.id) {
                if (button.style == gameData[player].style) return;
                c2 = gameData[player].style;
                C2.style = gameData[player].style;
                C2.disabled = true;
                button.update({ content: `**__TicTacToe__**\n${gameData[0].member} vs. ${gameData[1].member}\n\n${gameData[player].member} ist am Zug.`, components: [row1, row2, row3] });
                await checkWinner();
                player = (player + 1) % 2;
            }
            else if (button.customID == 'c3' && gameData[player].member.id == button.user.id) {
                if (button.style == gameData[player].style) return;
                c3 = gameData[player].style;
                C3.style = gameData[player].style;
                C3.disabled = true;
                button.update({ content: `**__TicTacToe__**\n${gameData[0].member} vs. ${gameData[1].member}\n\n${gameData[player].member} ist am Zug.`, components: [row1, row2, row3] });
                await checkWinner();
                player = (player + 1) % 2;
            };
        });

        collector.on('end', async () => {
            A1.disabled = true; A2.disabled = true; A3.disabled = true;
            B1.disabled = true; B2.disabled = true; B3.disabled = true;
            C1.disabled = true; C2.disabled = true; C3.disabled = true;
            interaction.editReply({ content: `**__TicTacToe__**\n${gameData[0].member} vs. ${gameData[1].member}\n\nDie Zeit ist abgelaufen! (5 Minuten)`, components: [row1, row2, row3] });
        });

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
                interaction.editReply({ content: `**__TicTacToe__**\n${gameData[0].member} vs. ${gameData[1].member}\n\nUnentschieden!`, components: [row1, row2, row3]});
                collector.stop();
            };
        };

        function stop() {
            midDuel.delete(user.id);
            midDuel.delete(target.id);

            A1.disabled = true; A2.disabled = true; A3.disabled = true;
            B1.disabled = true; B2.disabled = true; B3.disabled = true;
            C1.disabled = true; C2.disabled = true; C3.disabled = true;

            interaction.editReply({ content: `**__TicTacToe__**\n${gameData[0].member} vs. ${gameData[1].member}\n\n${gameData[player].member} gewinnt!`, components: [row1, row2, row3]});
            collector.stop();
        };
    },
};