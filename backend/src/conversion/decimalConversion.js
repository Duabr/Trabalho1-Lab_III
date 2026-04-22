const { NumberBase } = require('../enums/NumberBase');
const { parseBigIntInRadix } = require('./shared/parseBigIntInRadix');

/**
 * Base 10 (decimal) — alfabeto {0..9}.
 */

/**
 * @param {string} inputValue
 * @returns {string} representação binária (sem prefixo 0b)
 */
function toBinaryString(inputValue) {
  return parseBigIntInRadix(inputValue, NumberBase.DECIMAL).toString(2);
}

module.exports = {
  radix: NumberBase.DECIMAL,
  toBinaryString,
};
