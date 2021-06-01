const { handleBj } = require('../../features/blackjack');

module.exports = {
    description: '[BETA] Sahne große Gewinne bei Blackjack ab!',
    callback: ({ client, interaction }) => {
        handleBj(client, interaction)
        return [ 'Blackjack wird geladen...' ];
    }
}