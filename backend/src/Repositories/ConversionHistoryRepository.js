const db = require('../config/db');
const ConversionHistory = require('../models/ConversionHistory');
const { assertValidRadix } = require('../enums/NumberBase');

class ConversionHistoryRepository {
  /**
   * @param {{
   *   userId?: number | null,
   *   inputValue: string,
   *   fromBase: number,
   *   toBase: number,
   *   resultValue: string
   * }} data
   */
  async create(data) {
    assertValidRadix(data.fromBase, 'fromBase');
    assertValidRadix(data.toBase, 'toBase');
    const [result] = await db.query(
      `INSERT INTO conversion_history (user_id, input_value, from_base, to_base, result_value)
       VALUES (?, ?, ?, ?, ?)`,
      [
        data.userId ?? null,
        data.inputValue,
        data.fromBase,
        data.toBase,
        data.resultValue,
      ]
    );
    const row = await this.findById(result.insertId);
    if (!row) {
      throw new Error('Falha ao recuperar registro após criação.');
    }
    return row;
  }

  async findAll() {
    const [rows] = await db.query(
      `SELECT id, user_id, input_value, from_base, to_base, result_value, created_at
       FROM conversion_history
       ORDER BY id ASC`
    );
    return rows.map((r) => ConversionHistory.fromRow(r));
  }

  async findById(id) {
    const [rows] = await db.query(
      `SELECT id, user_id, input_value, from_base, to_base, result_value, created_at
       FROM conversion_history
       WHERE id = ?
       LIMIT 1`,
      [id]
    );
    return ConversionHistory.fromRow(rows[0]);
  }

  async findByUserId(userId) {
    const [rows] = await db.query(
      `SELECT id, user_id, input_value, from_base, to_base, result_value, created_at
       FROM conversion_history
       WHERE user_id = ?
       ORDER BY id ASC`,
      [userId]
    );
    return rows.map((r) => ConversionHistory.fromRow(r));
  }

  /**
   * @param {{
   *   userId?: number | null,
   *   inputValue?: string,
   *   fromBase?: number,
   *   toBase?: number,
   *   resultValue?: string
   * }} data
   */
  async update(id, data) {
    const fields = [];
    const values = [];
    if (data.userId !== undefined) {
      fields.push('user_id = ?');
      values.push(data.userId);
    }
    if (data.inputValue !== undefined) {
      fields.push('input_value = ?');
      values.push(data.inputValue);
    }
    if (data.fromBase !== undefined) {
      assertValidRadix(data.fromBase, 'fromBase');
      fields.push('from_base = ?');
      values.push(data.fromBase);
    }
    if (data.toBase !== undefined) {
      assertValidRadix(data.toBase, 'toBase');
      fields.push('to_base = ?');
      values.push(data.toBase);
    }
    if (data.resultValue !== undefined) {
      fields.push('result_value = ?');
      values.push(data.resultValue);
    }
    if (fields.length === 0) {
      return this.findById(id);
    }
    values.push(id);
    await db.query(
      `UPDATE conversion_history SET ${fields.join(', ')} WHERE id = ?`,
      values
    );
    return this.findById(id);
  }

  async delete(id) {
    const [result] = await db.query(
      'DELETE FROM conversion_history WHERE id = ?',
      [id]
    );
    return result.affectedRows > 0;
  }
}

module.exports = new ConversionHistoryRepository();
