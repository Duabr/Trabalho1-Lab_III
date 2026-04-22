const { NumberBase } = require('../enums/NumberBase');

/**
 * Base 60 (sexagesimal) — tempo HH:MM:SS / MM:SS ou segundos totais.
 */

/**
 * HH:MM:SS, MM:SS ou string só com segundos decimais (total).
 * @param {string} str
 * @returns {bigint}
 */
function parseSexagesimalToBigInt(str) {
  const t = str.trim();
  if (t.includes(':')) {
    const parts = t.split(':').map((p) => p.trim());
    if (parts.some((p) => !/^\d+$/.test(p))) {
      throw new RangeError('Use apenas dígitos nos trechos HH:MM:SS ou MM:SS.');
    }
    if (parts.length === 3) {
      const [h, m, sec] = parts;
      return BigInt(h) * 3600n + BigInt(m) * 60n + BigInt(sec);
    }
    if (parts.length === 2) {
      const [m, sec] = parts;
      return BigInt(m) * 60n + BigInt(sec);
    }
    throw new RangeError('Formato sexagesimal: HH:MM:SS ou MM:SS.');
  }
  if (!/^\d+$/.test(t)) {
    throw new RangeError('Sexagesimal: informe HH:MM:SS ou segundos totais (inteiro).');
  }
  return BigInt(t);
}

/**
 * Segundos totais → H:M:SS (minutos e segundos com dois dígitos).
 * @param {bigint} totalSeconds
 */
function formatSecondsToSexagesimalString(totalSeconds) {
  if (totalSeconds < 0n) {
    throw new RangeError('Segundos não negativos.');
  }
  const h = totalSeconds / 3600n;
  const rem = totalSeconds % 3600n;
  const m = rem / 60n;
  const s = rem % 60n;
  return `${h.toString()}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
}

/**
 * @param {string} inputValue
 * @returns {string} representação binária numérica (valor inteiro em base 2)
 */
function toBinaryString(inputValue) {
  return parseSexagesimalToBigInt(inputValue).toString(2);
}

module.exports = {
  radix: NumberBase.SEXAGESIMAL,
  parseSexagesimalToBigInt,
  formatSecondsToSexagesimalString,
  toBinaryString,
};
