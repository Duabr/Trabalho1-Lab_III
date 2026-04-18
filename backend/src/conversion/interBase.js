const { NumberBase, assertValidRadix } = require('../enums/NumberBase');
const binaryConversion = require('./binaryConversion');
const { parseBigIntInRadix } = require('./shared/parseBigIntInRadix');
const sexagesimalConversion = require('./sexagesimalConversion');
const base64Conversion = require('./base64Conversion');

/**
 * Interpreta o valor textual na base de origem como inteiro não negativo (BigInt).
 * Base64: bytes decodificados como inteiro big-endian sem sinal.
 *
 * @param {string} value
 * @param {number} fromBase
 * @returns {bigint}
 */
function parseValueToBigInt(value, fromBase) {
  assertValidRadix(fromBase, 'fromBase');
  switch (fromBase) {
    case NumberBase.BINARY:
      return parseBigIntInRadix(
        binaryConversion.normalizeToBinaryDigits(value),
        NumberBase.BINARY
      );
    case NumberBase.DECIMAL:
      return parseBigIntInRadix(value, NumberBase.DECIMAL);
    case NumberBase.HEXADECIMAL:
      return parseBigIntInRadix(value, NumberBase.HEXADECIMAL);
    case NumberBase.BASE36:
      return parseBigIntInRadix(value, NumberBase.BASE36);
    case NumberBase.SEXAGESIMAL:
      return sexagesimalConversion.parseSexagesimalToBigInt(value);
    case NumberBase.BASE64:
      return base64Conversion.parseToBigInt(value);
    default:
      throw new RangeError('Base de origem não suportada.');
  }
}

/**
 * Formata um inteiro não negativo na base de destino.
 *
 * @param {bigint} n
 * @param {number} toBase
 * @returns {string}
 */
function formatBigIntToBase(n, toBase) {
  assertValidRadix(toBase, 'toBase');
  if (n < 0n) {
    throw new RangeError('Resultado negativo não suportado neste conversor.');
  }
  switch (toBase) {
    case NumberBase.BINARY:
      return n.toString(2);
    case NumberBase.DECIMAL:
      return n.toString(10);
    case NumberBase.HEXADECIMAL:
      return n.toString(16);
    case NumberBase.BASE36:
      return n.toString(36);
    case NumberBase.SEXAGESIMAL:
      return sexagesimalConversion.formatSecondsToSexagesimalString(n);
    case NumberBase.BASE64:
      return base64Conversion.formatFromBigInt(n);
    default:
      throw new RangeError('Base de destino não suportada.');
  }
}

/**
 * Converte entre quaisquer bases suportadas (mesmo modelo canônico BigInt).
 *
 * @param {string} value
 * @param {number} fromBase
 * @param {number} toBase
 * @returns {string}
 */
function convertBetweenBases(value, fromBase, toBase) {
  assertValidRadix(fromBase, 'fromBase');
  assertValidRadix(toBase, 'toBase');
  const n = parseValueToBigInt(value, fromBase);
  return formatBigIntToBase(n, toBase);
}

module.exports = {
  parseValueToBigInt,
  formatBigIntToBase,
  convertBetweenBases,
};
