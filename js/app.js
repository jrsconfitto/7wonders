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
  , people = []
  , players
  , locations
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
        "Players": models[key].elements,
        "TotalPoints": models[key].elements.reduce(function(prev, curr) {
          return prev + +curr.total; 
        }, 0)
      };

      people = people.concat(models[key].elements);
      games.push(game);
    }
  }

  locations = d3.nest()
    .key(function(player) {
      return player.location
    })
    .entries(people);

  players = d3.nest()
    .key(function(player) { return player.name })
    .sortKeys(d3.ascending)
    .entries(people);

  // Slice up players into pairs for smaller blocks
  var slicedPlayers = [],
      playersPerGroup = 3;

  for (var i = 0; i < players.length + playersPerGroup; i = i + playersPerGroup) {
    slicedPlayers.push(players.slice(i, i + playersPerGroup));
  }

  // Now we get to the fun part?
  d3.select('#totalPoints')
    .text(games.reduce(function(prev, curr) {
      return prev + curr.TotalPoints;
    }, 0))
    .attr('class', 'bold');

  d3.select('#totalGames')
    .text(games.length)
    .attr('class', 'bold');

  d3.select('#totalPlayers')
    .text(players.length)
    .attr('class', 'bold');

  d3.select('#totalLocations')
    .text(locations.length)
    .attr('class', 'bold');

  var playerList = d3.select('#players')
    .append('div')
    .attr('id', 'playerList')

  // Create a row for every two players
  var playerRow = playerList.selectAll('div')
      .data(slicedPlayers)
    .enter().append('div')
      .attr('class', 'grid')

  // Each player gets their own little block with their own geopattern
  var playerBlock = playerRow.selectAll('div')
      .data(function(d) { return d; })
    .enter().append('div')
      .attr('class', 'unit one-third')
    .append('div')
      .attr('class', 'player rounded center-text')
      .style('background-image', function(player) {
        var pattern = GeoPattern.generate(player.key);
        return pattern.toDataUrl()
      })

    playerBlock.append('h3').append('a')
      .style('color', 'white')
      .attr('class', 'player')
      .attr('href', function(player) {
        return '#' + player.key
      })
      .text(function(player) {
        return player.key
      })
      .on('click', showUser)

  playerBlock.append('h4')
      .text(function(player) {
        var plural = (player.values.length > 1) ? 's' : ''
        return player.values.length + ' game' + plural
      })

  playerBlock.append('p')
      .text(function(player) {
        var totalPoints = player.values.reduce(function(prev, curr) {
          return prev + (+curr.total)
        }, 0);
        return totalPoints + ' points'
      })

  playerBlock.append('p')
      .text(function(player) {
        var totalPoints = player.values.reduce(function(prev, curr) {
          return prev + (+curr.total)
        }, 0);

        var avgPointsPerGame = totalPoints / player.values.length
        return numeral(avgPointsPerGame).format('0[.]00') + ' points per game'
      })
}

function showUser(data) {
  console.log(data);

  var selectedPlayer = d3.select('#selectedPlayer');
}
