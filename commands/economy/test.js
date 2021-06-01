const { MessageButton, MessageActionRow } = require("discord-buttons")

module.exports = {
    callback: ({ message}) => {
        const button_1 = new MessageButton()
            .setStyle('blurple')
            .setLabel('1')
            .setID('button_1');

        const button_2 = new MessageButton()
            .setStyle('blurple')
            .setLabel('2')
            .setID('button_2');

        const button_3 = new MessageButton()
            .setStyle('blurple')
            .setLabel('3')
            .setID('button_3');

        const button_4 = new MessageButton()
            .setStyle('blurple')
            .setLabel('4')
            .setID('button_4');

        const button_5 = new MessageButton()
            .setStyle('blurple')
            .setLabel('5')
            .setID('button_5');


        const button_6 = new MessageButton()
            .setStyle('blurple')
            .setLabel('6')
            .setID('button_6');
        
        // const buttonsActive = [ button_1, button_2, button_3, button_4, button_5 ]

        let row = new MessageActionRow()
            .addComponent(button_1)
            .addComponent(button_2)
            .addComponent(button_3)

        let row_2 = new MessageActionRow()
            .addComponent(button_4)
            .addComponent(button_5)
            .addComponent(button_6)
        
        message.channel.send('Test', {
            components: [ row, row_2 ]
        });
    }
}