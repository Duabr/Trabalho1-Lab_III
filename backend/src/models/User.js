/**
 * Representa a tabela `users`:
 * - id INT AUTO_INCREMENT PRIMARY KEY
 * - name VARCHAR(100) NOT NULL
 * - email VARCHAR(100) UNIQUE NOT NULL
 * - created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
 */
class User {
  /**
   * @param {object} data
   * @param {number|null} [data.id]
   * @param {string} data.name
   * @param {string} data.email
   * @param {Date|string|null} [data.created_at]
   */
  constructor({ id = null, name, email, created_at = null }) {
    this.id = id;
    this.name = name;
    this.email = email;
    this.created_at = created_at;
  }

  /**
   * Converte uma linha retornada pelo MySQL em instância de User.
   * @param {import('mysql2').RowDataPacket} row
   * @returns {User|null}
   */
  static fromRow(row) {
    if (!row) return null;
    return new User({
      id: row.id,
      name: row.name,
      email: row.email,
      created_at: row.created_at,
    });
  }
}

module.exports = User;
