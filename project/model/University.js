const pool = require('../database/database');

class University {
  static async create(universityData) {
    const { name, location, website, description } = universityData;
    const [result] = await pool.query(
      'INSERT INTO universities (name, location, website, description) VALUES (?, ?, ?, ?)',
      [name, location, website, description]
    );
    return result;
  }

  static async findById(id) {
    const [rows] = await pool.query('SELECT * FROM universities WHERE id = ?', [id]);
    return rows[0];
  }

  static async getAll() {
    const [rows] = await pool.query('SELECT * FROM universities');
    return rows;
  }

  static async update(id, universityData) {
    const { name, location, website, description } = universityData;
    const [result] = await pool.query(
      'UPDATE universities SET name = ?, location = ?, website = ?, description = ? WHERE id = ?',
      [name, location, website, description, id]
    );
    return result;
  }

  static async delete(id) {
    const [result] = await pool.query('DELETE FROM universities WHERE id = ?', [id]);
    return result;
  }
}

module.exports = University;
