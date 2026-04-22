const DIGITS = '0123456789abcdefghijklmnopqrstuvwxyz';

/**
 * Interpreta string numérica em bases 2–36 como BigInt (sem perda de precisão).
 * @param {string} str
 * @param {number} radix
 */
function parseBigIntInRadix(str, radix) {
  const s = str.trim().toLowerCase();
  if (!s) {
    throw new RangeError('Valor vazio.');
  }
  let result = 0n;
  for (let i = 0; i < s.length; i++) {
    const digit = DIGITS.indexOf(s[i]);
    if (digit === -1 || digit >= radix) {
      throw new RangeError(`Dígito inválido para base ${radix}: "${s[i]}"`);
    }
    result = result * BigInt(radix) + BigInt(digit);
  }
  return result;
}

module.exports = { parseBigIntInRadix, DIGITS };
