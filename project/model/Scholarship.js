const pool = require('../database/database');

class Scholarship {
  static async create(scholarshipData) {
    const { name, provider, amount, eligibitily, deadline, type, university_id } = scholarshipData;
    const [result] = await pool.query(
      'INSERT INTO Scholarship (name, provider, amount, eligibitily, deadline, type, uni_id) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [name, provider, amount, eligibitily, deadline, type, university_id]
    );
    return result;
  }

  static async findById(id) {
    const [rows] = await pool.query('SELECT * FROM Scholarship WHERE id = ?', [id]);
    return rows[0];
  }

  static async getAll() {
    const [rows] = await pool.query('SELECT * FROM Scholarship');
    return rows;
  }

  static async getByUniversity(universityId) {
    const [rows] = await pool.query('SELECT * FROM Scholarship WHERE uni_id = ?', [universityId]);
    return rows;
  }

  static async update(id, scholarshipData) {
    const { name, provider, amount, eligibitily, deadline, type, university_id } = scholarshipData;
    const [result] = await pool.query(
      'UPDATE Scholarship SET name = ?, provider = ?, amount = ?, eligibitily = ?, deadline = ?, type = ?, uni_id = ? WHERE id = ?',
      [name, provider, amount, eligibitily, deadline, type, university_id, id]
    );
    return result;
  }

  static async delete(id) {
    const [result] = await pool.query('DELETE FROM Scholarship WHERE id = ?', [id]);
    return result;
  }
}

module.exports = Scholarship;
