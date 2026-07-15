const pool = require('../database/database');

class TuitionFee {
  static async create(feeData) {
    const { amount, academicYear, major_id } = feeData;
    const [result] = await pool.query(
      'INSERT INTO tuitionfee (amount, academicYear, m_id) VALUES (?, ?, ?)',
      [amount, academicYear, major_id]
    );
    return result;
  }

  static async findById(id) {
    const [rows] = await pool.query('SELECT * FROM tuitionfee WHERE fee_id = ?', [id]);
    return rows[0];
  }

  static async getAll() {
    const [rows] = await pool.query('SELECT * FROM tuitionfee');
    return rows;
  }

  static async getByMajor(majorId) {
    const [rows] = await pool.query('SELECT * FROM tuitionfee WHERE m_id = ?', [majorId]);
    return rows;
  }

  static async getByUniversity(universityId) {
    const [rows] = await pool.query(
      `SELECT tf.* FROM tuitionfee tf
       JOIN Major m ON tf.m_id = m.m_id
       WHERE m.uni_id = ?`,
      [universityId]
    );
    return rows;
  }

  static async update(id, feeData) {
    const { amount, academicYear, major_id } = feeData;
    const [result] = await pool.query(
      'UPDATE tuitionfee SET amount = ?, academicYear = ?, m_id = ? WHERE fee_id = ?',
      [amount, academicYear, major_id, id]
    );
    return result;
  }

  static async delete(id) {
    const [result] = await pool.query('DELETE FROM tuitionfee WHERE fee_id = ?', [id]);
    return result;
  }
}

module.exports = TuitionFee;
