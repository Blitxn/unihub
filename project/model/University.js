const pool = require('../database/database');

class University {
  static async create(universityData) {
    const { name, location } = universityData;
    const [result] = await pool.query(
      'INSERT INTO University (name, location) VALUES (?, ?)',
      [name, location]
    );
    return result;
  }

  static async findById(id) {
    const [rows] = await pool.query('SELECT * FROM University WHERE uni_id = ?', [id]);
    return rows[0];
  }

  static async getAll() {
    const [rows] = await pool.query('SELECT * FROM University');
    return rows;
  }

  static async update(id, universityData) {
    const { name, location } = universityData;
    const [result] = await pool.query(
      'UPDATE University SET name = ?, location = ? WHERE uni_id = ?',
      [name, location, id]
    );
    return result;
  }

  static async delete(id) {
    const [result] = await pool.query('DELETE FROM University WHERE uni_id = ?', [id]);
    return result;
  }
}

module.exports = University;
