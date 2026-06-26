const pool = require('../database/database');

class Major {
  static async create(majorData) {
    const { name, duration, program_id, university_id } = majorData;
    const [result] = await pool.query(
      'INSERT INTO Major (name, duration, p_id, uni_id) VALUES (?, ?, ?, ?)',
      [name, duration, program_id, university_id]
    );
    return result;
  }

  static async findById(id) {
    const [rows] = await pool.query('SELECT * FROM Major WHERE m_id = ?', [id]);
    return rows[0];
  }

  static async getAll() {
    const [rows] = await pool.query('SELECT * FROM Major');
    return rows;
  }

  static async getByUniversity(universityId) {
    const [rows] = await pool.query('SELECT * FROM Major WHERE uni_id = ?', [universityId]);
    return rows;
  }

  static async update(id, majorData) {
    const { name, duration, program_id, university_id } = majorData;
    const [result] = await pool.query(
      'UPDATE Major SET name = ?, duration = ?, p_id = ?, uni_id = ? WHERE m_id = ?',
      [name, duration, program_id, university_id, id]
    );
    return result;
  }

  static async delete(id) {
    const [result] = await pool.query('DELETE FROM Major WHERE m_id = ?', [id]);
    return result;
  }
}

module.exports = Major;
