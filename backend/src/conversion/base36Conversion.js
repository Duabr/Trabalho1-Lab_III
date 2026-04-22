const { NumberBase } = require('../enums/NumberBase');
const { parseBigIntInRadix } = require('./shared/parseBigIntInRadix');

/**
 * Base 36 — alfabeto {0..9, A..Z}.
 */

/**
 * @param {string} inputValue
 * @returns {string} representação binária (sem prefixo 0b)
 */
function toBinaryString(inputValue) {
  return parseBigIntInRadix(inputValue, NumberBase.BASE36).toString(2);
}

module.exports = {
  radix: NumberBase.BASE36,
  toBinaryString,
};
