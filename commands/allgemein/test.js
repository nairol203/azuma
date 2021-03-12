module.exports = {
    slash: true,
    description: 'test - 1 - 2 - 3 - ?',
    options: [
        {
            name: 'donk',
            description: 'donki donk',
            type: 3,
            choices: [
                {
                    name: '1',
                    value: '1',
                },
                {
                    name: '2',
                    value: '2',
                },
                {
                    name: '3',
                    value: '3',
                },
            ] 
        }
    ],
    callback: ({}) => {
        return 'test erfolgreich!'
    }
}