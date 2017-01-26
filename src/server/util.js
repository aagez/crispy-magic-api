
const winston = require('winston');

const TYPE_MAP = {
  "C" : "Creature",
  "A" : "Artifact",
  "E" : "Enchantment",
  "I" : "Instant",
  "S" : "Sorcery",
  "P" : "Planeswalker",
  "L" : "Land",
  "N" : "Plane",
  "O" : "Phenomenon"
}

const COLOR_MAP = {
  "U" : "Blue",
  "B" : "Black",
  "W" : "White",
  "R" : "Red",
  "G" : "Green"
}

exports.parseTypes = (param) => {
  const res = [];
  var i = 0;
  for(var letter of param) {
    letter = letter.toUpperCase();
    if (TYPE_MAP.hasOwnProperty(letter)) {
      const type = TYPE_MAP[letter];
      if (res.indexOf(type) === -1)
        res[i++] = type;
    }
    else
      winston.warn("Unknown type : " + letter);
  }
  return res;
}

exports.parseColors = (param) => {
  const res = [];
  var i = 0;
  for(var letter of param) {
    letter = letter.toUpperCase();
    if (COLOR_MAP.hasOwnProperty(letter)) {
      const color = COLOR_MAP[letter];
      if (res.indexOf(color) === -1)
        res[i++] = color;
    }
    else
      winston.warn("Unknown color : " + letter);
  }
  return res;
}
