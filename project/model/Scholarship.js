const pool = require('../database/database');

class Scholarship {
  static async create(scholarshipData) {
    const { name, amount, requirements, university_id } = scholarshipData;
    const [result] = await pool.query(
      'INSERT INTO scholarships (name, amount, requirements, university_id) VALUES (?, ?, ?, ?)',
      [name, amount, requirements, university_id]
    );
    return result;
  }

  static async findById(id) {
    const [rows] = await pool.query('SELECT * FROM scholarships WHERE id = ?', [id]);
    return rows[0];
  }

  static async getAll() {
    const [rows] = await pool.query('SELECT * FROM scholarships');
    return rows;
  }

  static async getByUniversity(universityId) {
    const [rows] = await pool.query('SELECT * FROM scholarships WHERE university_id = ?', [universityId]);
    return rows;
  }

  static async update(id, scholarshipData) {
    const { name, amount, requirements, university_id } = scholarshipData;
    const [result] = await pool.query(
      'UPDATE scholarships SET name = ?, amount = ?, requirements = ?, university_id = ? WHERE id = ?',
      [name, amount, requirements, university_id, id]
    );
    return result;
  }

  static async delete(id) {
    const [result] = await pool.query('DELETE FROM scholarships WHERE id = ?', [id]);
    return result;
  }
}

module.exports = Scholarship;
