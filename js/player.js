// Handle has changes and find the current user
window.addEventListener('hashchange', function() {
  if (window.location.hash !== '') {
    // Remove the hash from the player's name
    playerName = window.location.hash.substr(1);
    console.info('Showing user ' + playerName + '\'s game data');

    // Show/Hide the right blocks
    d3.select('#players')
      .style('display', 'none');
    d3.select('#selectedPlayer')
      .style('display', 'block');

    var player = gamePlayers.filter(function(player) {
      return player.key == playerName;  
    }).reduce(function(a, b) {
      return a.concat(b);
    }).values.map(function(game, i) {
      // Return the scores for each game
      return game.scores;
    });

    // i think we should replace the entire players section
    var playerPattern = GeoPattern.generate(playerName);
    d3.select('#selectedPlayerName')
      .text(playerName)
      .style('background-image', playerPattern.toDataUrl())
  }
});
