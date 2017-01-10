
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
