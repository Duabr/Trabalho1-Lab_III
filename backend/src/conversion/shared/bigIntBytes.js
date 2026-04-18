/**
 * Big-endian unsigned: bytes ↔ BigInt (para Base64 e representação unificada).
 */

/**
 * @param {Buffer} buf
 * @returns {bigint}
 */
function bufferToBigInt(buf) {
  let n = 0n;
  for (let i = 0; i < buf.length; i++) {
    n = (n << 8n) + BigInt(buf[i]);
  }
  return n;
}

/**
 * Representação mínima em bytes (big-endian), sem sinal.
 * @param {bigint} n
 * @returns {Buffer}
 */
function bigIntToUnsignedBuffer(n) {
  if (n < 0n) {
    throw new RangeError('Apenas valores inteiros não negativos são suportados.');
  }
  if (n === 0n) {
    return Buffer.from([0]);
  }
  let hex = n.toString(16);
  if (hex.length % 2 === 1) {
    hex = `0${hex}`;
  }
  return Buffer.from(hex, 'hex');
}

module.exports = {
  bufferToBigInt,
  bigIntToUnsignedBuffer,
};
