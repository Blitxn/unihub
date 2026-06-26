const pool = require('../database/database');

class Faculty {
  static async create(facultyData) {
    const { name, university_id } = facultyData;
    const [result] = await pool.query(
      'INSERT INTO Program (name, uni_id) VALUES (?, ?)',
      [name, university_id]
    );
    return result;
  }

  static async findById(id) {
    const [rows] = await pool.query('SELECT * FROM Program WHERE p_id = ?', [id]);
    return rows[0];
  }

  static async getAll() {
    const [rows] = await pool.query('SELECT * FROM Program');
    return rows;
  }

  static async getByUniversity(universityId) {
    const [rows] = await pool.query('SELECT * FROM Program WHERE uni_id = ?', [universityId]);
    return rows;
  }

  static async update(id, facultyData) {
    const { name, university_id } = facultyData;
    const [result] = await pool.query(
      'UPDATE Program SET name = ?, uni_id = ? WHERE p_id = ?',
      [name, university_id, id]
    );
    return result;
  }

  static async delete(id) {
    const [result] = await pool.query('DELETE FROM Program WHERE p_id = ?', [id]);
    return result;
  }
}

module.exports = Faculty;
