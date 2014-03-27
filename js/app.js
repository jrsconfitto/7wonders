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
  , playersNest
  , locationsNest
  , gameDateFormat = d3.time.format('%Y-%m-%d')

function loaded(data, tabletop) {
  // i'm getting TableTop models because i want to see all the sheets
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

  playersNest = d3.nest()
    .key(function(player) { return player.name })
    .sortKeys(d3.ascending)
    .entries(players);

  locationsNest = d3.nest()
    .key(function(player) {
      return player.location
    })
    .entries(players);

  // Now we get to the fun part?
  d3.select('#totalGames')
    .text(games.length)
    .attr('class', 'bold');

  d3.select('#totalPlayers')
    .text(playersNest.length)
    .attr('class', 'bold');

  d3.select('#totalLocations')
    .text(locationsNest.length)
    .attr('class', 'bold');

  var playerPoints =
    d3.select('#playerList').selectAll('li')
        .data(playersNest)
      .enter().append('li')

  playerPoints.insert('a')
      // When i'm ready for personalized user pages
      /*.attr('href', function(player) {
        return '#player/' + player.key
      })*/
      .text(function(player) {
        return player.key
      })

  playerPoints.append('span')
      .html(function(player) {
        var plural = (player.values.length > 1) ? 's' : ''
        return '&nbsp;&dash; ' + player.values.length + ' game' + plural
      })
}

