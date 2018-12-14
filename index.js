const stopwords = require("./data/stopwords.json");
const common = require("./data/common.json");
const characters = require("./data/characters.json");
module.exports = function(text = [], n = 4) {
  var temp = [];
  var gramCounts = {};

  for (let t = 0; t < text.length; t++) {
    if (!text[t]) continue;
    const tokens = text[t]
      .split(" ")
      .map(word => {
        return word
          .replace(/[\[\]©•†”™—~»·!®@#$%^*()=_+|;:",.<>?']/gim, "")
          .replace("&", " and ")
          .replace(/\s\s+/g, " ")
          .trim()
          .toLowerCase();
      })
      .filter(word => {
        return word.trim().length > 0;
      });

    var l = tokens.length;

    for (let i = 1; i <= n; i++) {
      for (var j = 0; j < l; j++) {
        if (j + i <= l) {
          var ngram = tokens.slice(j, Math.min(j + i, l));
          if (ngram.length > 0) {
            const phrase = ngram.join(" ");
            const first = ngram[0];
            const last = ngram[ngram.length - 1];
            if (
              phrase.length > 2 &&
              isNaN(parseInt(phrase)) &&
              ![...stopwords, ...characters].includes(first) &&
              ![...stopwords, ...characters].includes(last) &&
              ![...common].includes(phrase)
            ) {
              temp.push(phrase);
              if (!gramCounts.hasOwnProperty(ngram.length))
                gramCounts[ngram.length] = 0;

              gramCounts[ngram.length]++;
            }
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
    const percent = counts[key] / gramCounts[key.split(" ").length];
    if (percent > 0.0075 && counts[key] > 1)
      keywords.push({
        word: key,
        count: counts[key],
        grams: key.split(" ").length,
        percent: percent.toPrecision(3)
      });
  }
  return keywords;
};
