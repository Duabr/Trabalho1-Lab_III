const { NumberBase, assertValidRadix } = require('../enums/NumberBase');
const binaryConversion = require('./binaryConversion');
const decimalConversion = require('./decimalConversion');
const hexadecimalConversion = require('./hexadecimalConversion');
const base36Conversion = require('./base36Conversion');
const sexagesimalConversion = require('./sexagesimalConversion');
const base64Conversion = require('./base64Conversion');
const { parseBigIntInRadix } = require('./shared/parseBigIntInRadix');
const {
  parseValueToBigInt,
  formatBigIntToBase,
  convertBetweenBases,
} = require('./interBase');

/**
 * Converte um valor na base de origem para string binária do **inteiro canônico** (numeral em base 2).
 *
 * @param {string} inputValue
 * @param {number} fromBase
 * @returns {string}
 */
function convertToBinary(inputValue, fromBase) {
  return convertBetweenBases(inputValue, fromBase, NumberBase.BINARY);
}

/**
 * Converte entre quaisquer bases suportadas (pipeline: parse → BigInt → format).
 *
 * @param {string} value
 * @param {number} fromBase
 * @param {number} toBase
 * @returns {string}
 */
function convertValue(value, fromBase, toBase) {
  return convertBetweenBases(value, fromBase, toBase);
}

/** Bits brutos por byte após decodificar Base64 (comportamento legado). */
function base64InputToBinaryBits(str) {
  return base64Conversion.decodedBytesToRawBitsString(str);
}

module.exports = {
  convertToBinary,
  convertValue,
  parseBigIntInRadix,
  parseValueToBigInt,
  formatBigIntToBase,
  convertBetweenBases,
  parseSexagesimalToBigInt: sexagesimalConversion.parseSexagesimalToBigInt,
  base64InputToBinaryBits,
  binaryConversion,
  decimalConversion,
  hexadecimalConversion,
  base36Conversion,
  sexagesimalConversion,
  base64Conversion,
};
