const db = require('../config/db');
const User = require('../models/User');

class UserRepository {
  /** @param {{ name: string, email: string }} data */
  async create(data) {
    const [result] = await db.query(
      'INSERT INTO users (name, email) VALUES (?, ?)',
      [data.name, data.email]
    );
    const user = await this.findById(result.insertId);
    if (!user) {
      throw new Error('Falha ao recuperar usuário após criação.');
    }
    return user;
  }

  async findAll() {
    const [rows] = await db.query(
      'SELECT id, name, email, created_at FROM users ORDER BY id ASC'
    );
    return rows.map((row) => User.fromRow(row));
  }

  async findById(id) {
    const [rows] = await db.query(
      'SELECT id, name, email, created_at FROM users WHERE id = ? LIMIT 1',
      [id]
    );
    const row = rows[0];
    return User.fromRow(row);
  }

  async findByEmail(email) {
    const [rows] = await db.query(
      'SELECT id, name, email, created_at FROM users WHERE email = ? LIMIT 1',
      [email]
    );
    const row = rows[0];
    return User.fromRow(row);
  }

  /** @param {{ name?: string, email?: string }} data */
  async update(id, data) {
    const fields = [];
    const values = [];
    if (data.name !== undefined) {
      fields.push('name = ?');
      values.push(data.name);
    }
    if (data.email !== undefined) {
      fields.push('email = ?');
      values.push(data.email);
    }
    if (fields.length === 0) {
      return this.findById(id);
    }
    values.push(id);
    await db.query(
      `UPDATE users SET ${fields.join(', ')} WHERE id = ?`,
      values
    );
    return this.findById(id);
  }

  async delete(id) {
    const [result] = await db.query('DELETE FROM users WHERE id = ?', [id]);
    return result.affectedRows > 0;
  }
}

module.exports = new UserRepository();
