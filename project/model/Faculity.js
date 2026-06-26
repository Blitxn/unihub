const pool = require('../database/database');

class Faculty {
  static async create(facultyData) {
    const { name, description, university_id } = facultyData;
    const [result] = await pool.query(
      'INSERT INTO faculties (name, description, university_id) VALUES (?, ?, ?)',
      [name, description, university_id]
    );
    return result;
  }

  static async findById(id) {
    const [rows] = await pool.query('SELECT * FROM faculties WHERE id = ?', [id]);
    return rows[0];
  }

  static async getAll() {
    const [rows] = await pool.query('SELECT * FROM faculties');
    return rows;
  }

  static async getByUniversity(universityId) {
    const [rows] = await pool.query('SELECT * FROM faculties WHERE university_id = ?', [universityId]);
    return rows;
  }

  static async update(id, facultyData) {
    const { name, description, university_id } = facultyData;
    const [result] = await pool.query(
      'UPDATE faculties SET name = ?, description = ?, university_id = ? WHERE id = ?',
      [name, description, university_id, id]
    );
    return result;
  }

  static async delete(id) {
    const [result] = await pool.query('DELETE FROM faculties WHERE id = ?', [id]);
    return result;
  }
}

module.exports = Faculty;
