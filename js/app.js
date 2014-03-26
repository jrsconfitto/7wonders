document.addEventListener('DOMContentLoaded', function() {
  var gData
  // https://docs.google.com/spreadsheets/d/1Whyq_IPIWrm7L6qTeu4IuSQ2RWnwtfwWiVwhA-jGEtQ/pubhtml
  var key = 'https://docs.google.com/spreadsheet/pub?key=0AmhWglGO45rldFBiek84a1FHRmhPQjZaVzRSRGJZbXc&output=html'
  Tabletop.init({
    key: key,
    callback: loaded
  });
});

var models
  , games = []
  , players = []
  , gameDateFormat = d3.time.format('%Y-%m-%d');

function loaded(data, tabletop) {
  // i'm getting TableTop models because i want a whole bunch of sheets
  models = data;

  // Enumerate through the sheets
  for (var key in models) {
    // Discard the template sheet
    if (models.hasOwnProperty(key) && key !== 'Template') {

      var date = gameDateFormat.parse(key.slice(0, 10));
      var gameNumberString = (key.length > 10) ? key.slice(10): 1;

      var game = {
        "Date": date,
        "GameNumber": gameNumberString,
        "Players": models[key].elements
      };
      players = players.concat(models[key].elements);
      games.push(game);
    }
  }

  players = d3.map(players);

  // James/Jamie are the same person! me!
  var uniquePlayers = d3.set(players.values().map(function(player) {
    return player.name
  })).values()

  // Now we get to the fun part?
  d3.select('#totalGames').text(games.length);
  d3.select('#playerTotals').text(uniquePlayers.length);
}

