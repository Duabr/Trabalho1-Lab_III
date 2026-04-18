const { enrichConversionHistory } = require('../enums/NumberBase');

/**
 * Representa a tabela `conversion_history`:
 * - id INT AUTO_INCREMENT PRIMARY KEY
 * - user_id INT (FK users, ON DELETE CASCADE)
 * - input_value VARCHAR(255) NOT NULL
 * - from_base INT NOT NULL (valores: enum NumberBase / radix)
 * - to_base INT NOT NULL
 * - result_value VARCHAR(255) NOT NULL
 * - created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
 */
class ConversionHistory {
  /**
   * @param {object} data
   * @param {number|null} [data.id]
   * @param {number|null} [data.userId]
   * @param {string} data.inputValue
   * @param {number} data.fromBase
   * @param {number} data.toBase
   * @param {string} data.resultValue
   * @param {Date|string|null} [data.created_at]
   */
  constructor({
    id = null,
    userId = null,
    inputValue,
    fromBase,
    toBase,
    resultValue,
    created_at = null,
  }) {
    this.id = id;
    this.userId = userId;
    this.inputValue = inputValue;
    this.fromBase = fromBase;
    this.toBase = toBase;
    this.resultValue = resultValue;
    this.created_at = created_at;
  }

  /**
   * @param {import('mysql2').RowDataPacket} row
   * @returns {ConversionHistory|null}
   */
  static fromRow(row) {
    if (!row) return null;
    return new ConversionHistory({
      id: row.id,
      userId: row.user_id != null ? row.user_id : null,
      inputValue: row.input_value,
      fromBase: row.from_base,
      toBase: row.to_base,
      resultValue: row.result_value,
      created_at: row.created_at,
    });
  }

  /** Usado por `res.json()` — inclui fromBaseKey, toBaseKey, labels. */
  toJSON() {
    return enrichConversionHistory(this);
  }
}

module.exports = ConversionHistory;
