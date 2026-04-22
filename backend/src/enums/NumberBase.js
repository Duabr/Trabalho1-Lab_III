/**
 * Bases numéricas suportadas pelo sistema.
 * O valor de cada constante é a radix (base) usada no banco (from_base / to_base).
 */
const NumberBase = Object.freeze({
  /** Binária — {0, 1} */
  BINARY: 2,
  /** Decimal — {0..9} */
  DECIMAL: 10,
  /** Hexadecimal — {0..9, A..F} */
  HEXADECIMAL: 16,
  /** Alfanumérica 0-9 e A-Z */
  BASE36: 36,
  /** Sexagesimal (tempo, ângulos) */
  SEXAGESIMAL: 60,
  /** Base64 (codificação de dados) */
  BASE64: 64,
});

/** @type {ReadonlyArray<number>} */
const RADICES = Object.freeze(Object.values(NumberBase));

const META = Object.freeze({
  [NumberBase.BINARY]: {
    key: 'BINARY',
    label: 'Base 2 (binária)',
    description: 'Alfabeto {0, 1}; linguagem nativa do hardware.',
  },
  [NumberBase.DECIMAL]: {
    key: 'DECIMAL',
    label: 'Base 10 (decimal)',
    description: 'Alfabeto {0..9}; ponte usual entre bases.',
  },
  [NumberBase.HEXADECIMAL]: {
    key: 'HEXADECIMAL',
    label: 'Base 16 (hexadecimal)',
    description: 'Alfabeto {0..9, A..F}; memória, cores CSS, nibbles.',
  },
  [NumberBase.BASE36]: {
    key: 'BASE36',
    label: 'Base 36 (alfanumérica)',
    description: 'Alfabeto {0..9, A..Z}; IDs curtos, URL shorteners.',
  },
  [NumberBase.SEXAGESIMAL]: {
    key: 'SEXAGESIMAL',
    label: 'Base 60 (sexagesimal)',
    description: 'Tempo (HH:MM:SS) e ângulos; tradição babilônica.',
  },
  [NumberBase.BASE64]: {
    key: 'BASE64',
    label: 'Base 64 (codificação)',
    description: 'A–Z, a–z, 0–9, +, /; dados binários em texto (HTTP, anexos).',
  },
});

/**
 * @param {unknown} value
 * @returns {value is number}
 */
function isValidRadix(value) {
  return (
    typeof value === 'number' &&
    Number.isInteger(value) &&
    RADICES.includes(value)
  );
}

/**
 * @param {unknown} value
 * @param {string} fieldName
 * @throws {RangeError}
 */
function assertValidRadix(value, fieldName) {
  if (!isValidRadix(value)) {
    throw new RangeError(
      `${fieldName} deve ser uma base suportada (use NumberBase.*): ${RADICES.join(', ')}`
    );
  }
}

/**
 * @param {number} radix
 */
function getMeta(radix) {
  return META[radix] ?? null;
}

/**
 * Lista todas as bases para selects / documentação da API.
 */
function listSupportedBases() {
  return RADICES.map((radix) => {
    const m = META[radix];
    return {
      radix,
      key: m.key,
      label: m.label,
      description: m.description,
    };
  });
}

/**
 * Enriquece um registro de conversão com chave e rótulo das bases (útil em GET / res.json).
 * @param {import('../models/ConversionHistory')|null} record
 */
function enrichConversionHistory(record) {
  if (!record) return null;
  const from = getMeta(record.fromBase);
  const to = getMeta(record.toBase);
  return {
    id: record.id,
    userId: record.userId,
    inputValue: record.inputValue,
    fromBase: record.fromBase,
    toBase: record.toBase,
    resultValue: record.resultValue,
    created_at: record.created_at,
    fromBaseKey: from?.key ?? null,
    toBaseKey: to?.key ?? null,
    fromBaseLabel: from?.label ?? null,
    toBaseLabel: to?.label ?? null,
  };
}

module.exports = {
  NumberBase,
  RADICES,
  isValidRadix,
  assertValidRadix,
  getMeta,
  listSupportedBases,
  enrichConversionHistory,
};
