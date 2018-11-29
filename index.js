const stopwords = require("./stopwords.json");

module.exports = function(text = [], n = 3) {
  var temp = [];
  for (let t = 0; t < text.length; t++) {
    if (!text[t]) continue;
    const tokens = text[t].split(" ").filter(word => {
      if (word.trim().length == 0) return false;
      return !stopwords.includes(word.toLowerCase());
    });

    var l = tokens.length;

    for (let i = 1; i <= n; i++) {
      for (var j = 0; j < l; j++) {
        if (j + i <= l) {
          var ngram = tokens.slice(j, Math.min(j + i, l));
          if (ngram.length > 0) {
            const phrase = ngram
              .join(" ")
              .replace(/[!@#$%^&*()=_+|;:",.<>?']/g, "")
              .trim()
              .toLowerCase();
            if ((phrase.length > 1) & isNaN(parseInt(phrase)))
              temp.push(phrase);
          }
        }
      }
    }
  }
  var counts = {};
  for (var i = 0; i < temp.length; i++) {
    counts[temp[i]] = counts[temp[i]] ? counts[temp[i]] + 1 : 1;
  }
  var keywords = [];
  for (var key in counts) {
    if (counts[key] > 2) keywords.push({ word: key, count: counts[key] });
  }
  return keywords;
};
