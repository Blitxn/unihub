const pool = require('../database/database');

class TuitionFee {
  static async create(feeData) {
    const { amount, year, major_id, university_id } = feeData;
    const [result] = await pool.query(
      'INSERT INTO tuition_fees (amount, year, major_id, university_id) VALUES (?, ?, ?, ?)',
      [amount, year, major_id, university_id]
    );
    return result;
  }

  static async findById(id) {
    const [rows] = await pool.query('SELECT * FROM tuition_fees WHERE id = ?', [id]);
    return rows[0];
  }

  static async getAll() {
    const [rows] = await pool.query('SELECT * FROM tuition_fees');
    return rows;
  }

  static async getByMajor(majorId) {
    const [rows] = await pool.query('SELECT * FROM tuition_fees WHERE major_id = ?', [majorId]);
    return rows;
  }

  static async getByUniversity(universityId) {
    const [rows] = await pool.query('SELECT * FROM tuition_fees WHERE university_id = ?', [universityId]);
    return rows;
  }

  static async update(id, feeData) {
    const { amount, year, major_id, university_id } = feeData;
    const [result] = await pool.query(
      'UPDATE tuition_fees SET amount = ?, year = ?, major_id = ?, university_id = ? WHERE id = ?',
      [amount, year, major_id, university_id, id]
    );
    return result;
  }

  static async delete(id) {
    const [result] = await pool.query('DELETE FROM tuition_fees WHERE id = ?', [id]);
    return result;
  }
}

module.exports = TuitionFee;
