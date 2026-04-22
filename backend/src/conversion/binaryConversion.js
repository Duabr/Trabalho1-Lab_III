/**
 * Base 2 (binária) — alfabeto {0, 1}.
 * Validação e normalização de strings binárias.
 */

/**
 * Remove espaços e garante que a entrada seja só 0/1.
 * @param {string} inputValue
 * @returns {string} sequência de 0 e 1
 */
function normalizeToBinaryDigits(inputValue) {
  const s = String(inputValue).replace(/\s/g, '');
  if (!s) {
    throw new RangeError('Valor binário vazio.');
  }
  if (!/^[01]+$/.test(s)) {
    throw new RangeError('Binário: use apenas os dígitos 0 e 1.');
  }
  return s;
}

module.exports = {
  normalizeToBinaryDigits,
};
