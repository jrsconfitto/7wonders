// Handle has changes and find the current user
window.addEventListener('hashchange', function() {
  if (window.location.hash !== '') {
    // Remove the hash from the player's name
    playerName = window.location.hash.substr(1);
    console.info('Showing user ' + playerName + '\'s game data');

    var player = gamePlayers.filter(function(player) {
      return player.key == playerName;  
    }).reduce(function(a, b) {
      return a.concat(b);
    }).values.map(function(game, i) {
      // Return the scores for each game
      return game.scores;
    });

    // i think we should replace the entire players section
    d3.select('#selectedPlayer')
      .text(playerName);
  }
});
