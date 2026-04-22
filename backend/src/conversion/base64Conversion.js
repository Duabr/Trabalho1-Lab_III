const { NumberBase } = require('../enums/NumberBase');
const { bufferToBigInt, bigIntToUnsignedBuffer } = require('./shared/bigIntBytes');

/**
 * Base 64 (codificação RFC) — bytes ↔ texto Base64.
 * Na conversão universal, o payload decodificado é tratado como inteiro big-endian sem sinal.
 */

/**
 * Decodifica Base64 → bytes → inteiro não negativo (big-endian).
 * @param {string} str
 * @returns {bigint}
 */
function parseToBigInt(str) {
  const cleaned = str.replace(/\s/g, '');
  if (!cleaned.length) {
    throw new RangeError('Valor Base64 vazio.');
  }
  let buf;
  try {
    buf = Buffer.from(cleaned, 'base64');
  } catch {
    throw new RangeError('Base64 inválida.');
  }
  if (buf.length === 0) {
    throw new RangeError('Base64 inválida ou vazia após decodificação.');
  }
  return bufferToBigInt(buf);
}

/**
 * Inteiro → bytes mínimos big-endian → Base64.
 * @param {bigint} n
 * @returns {string}
 */
function formatFromBigInt(n) {
  return bigIntToUnsignedBuffer(n).toString('base64');
}

/**
 * Valor numérico na base 2 (string de 0/1 do inteiro canônico), alinhado às outras bases.
 * @param {string} str
 */
function toBinaryString(str) {
  return parseToBigInt(str).toString(2);
}

/**
 * Cada byte decodificado vira 8 bits (0/1) concatenados — visão “bruta” dos octetos (ex.: ASCII).
 * Diferente do numeral binário do inteiro canônico quando há vários bytes.
 * @param {string} str
 */
function decodedBytesToRawBitsString(str) {
  const cleaned = str.replace(/\s/g, '');
  if (!cleaned.length) {
    throw new RangeError('Valor Base64 vazio.');
  }
  let buf;
  try {
    buf = Buffer.from(cleaned, 'base64');
  } catch {
    throw new RangeError('Base64 inválida.');
  }
  if (buf.length === 0) {
    throw new RangeError('Base64 inválida ou vazia após decodificação.');
  }
  return [...buf].map((b) => b.toString(2).padStart(8, '0')).join('');
}

module.exports = {
  radix: NumberBase.BASE64,
  parseToBigInt,
  formatFromBigInt,
  toBinaryString,
  decodedBytesToRawBitsString,
};
