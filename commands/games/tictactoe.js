const { MessageEmbed } = require("discord.js");
const { send, edit } = require('../../features/slash');

module.exports = {
    description: 'Spiele Tic Tac Toe mit einem anderen User',
    options: [
        {
            name: 'user',
            description: 'Den User mit dem du spielen möchtest',
            type: 6,
            required: true,
        },
    ],
    callback: ({}) => {
        return [ 'Dieser Befehl ist noch nicht fertig! Behalte <#800336595264995348> im Auge um den Release nicht zu verpassen!' ];
    }
}