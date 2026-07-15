const pool = require('../database/database');

class Program {
  static async create(programData) {
    const { name, university_id } = programData;
    const [result] = await pool.query(
      'INSERT INTO program (name, uni_id) VALUES (?, ?)',
      [name, university_id]
    );
    return result;
  }

  static async findById(id) {
    const [rows] = await pool.query('SELECT * FROM program WHERE p_id = ?', [id]);
    return rows[0];
  }

  static async getAll() {
    const [rows] = await pool.query('SELECT * FROM program');
    return rows;
  }

  static async getByUniversity(universityId) {
    const [rows] = await pool.query('SELECT * FROM program WHERE uni_id = ?', [universityId]);
    return rows;
  }
}

module.exports = Program;