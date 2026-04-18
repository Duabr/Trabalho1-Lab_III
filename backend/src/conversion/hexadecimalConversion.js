const { NumberBase } = require('../enums/NumberBase');
const { parseBigIntInRadix } = require('./shared/parseBigIntInRadix');

/**
 * Base 16 (hexadecimal) — alfabeto {0..9, A..F}.
 */

/**
 * @param {string} inputValue
 * @returns {string} representação binária (sem prefixo 0b)
 */
function toBinaryString(inputValue) {
  return parseBigIntInRadix(inputValue, NumberBase.HEXADECIMAL).toString(2);
}

module.exports = {
  radix: NumberBase.HEXADECIMAL,
  toBinaryString,
};
