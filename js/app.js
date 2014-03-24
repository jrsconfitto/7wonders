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
  , games = [];

function loaded(data, tabletop) {
  // i'm getting TableTop models because i want a whole bunch of sheets
  models = data;

  // Enumerate through the sheets
  for (var key in models) {
    // Discard the template sheet
    if (models.hasOwnProperty(key) && key !== 'Template') {
      var game = {
        "Date": key,
        "Players": models[key].elements
      };

      games.push(game);
    }
  };

  // Filter out the Template model
  // games = data.filter(function(sheet) {
  //   return sheet.name !== 'Template';
  // });
}
