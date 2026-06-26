const pool = require('../database/database');

class Career {
  static async create(careerData) {
    const { job_title, description, salaryMin, salaryMax, major_id } = careerData;
    const [result] = await pool.query(
      'INSERT INTO Career (job_title, description, salaryMin, salaryMax, m_id) VALUES (?, ?, ?, ?, ?)',
      [job_title, description, salaryMin, salaryMax, major_id]
    );
    return result;
  }

  static async findById(id) {
    const [rows] = await pool.query('SELECT * FROM Career WHERE id = ?', [id]);
    return rows[0];
  }

  static async getAll() {
    const [rows] = await pool.query('SELECT * FROM Career');
    return rows;
  }

  static async getByMajor(majorId) {
    const [rows] = await pool.query('SELECT * FROM Career WHERE m_id = ?', [majorId]);
    return rows;
  }

  static async update(id, careerData) {
    const { job_title, description, salaryMin, salaryMax, major_id } = careerData;
    const [result] = await pool.query(
      'UPDATE Career SET job_title = ?, description = ?, salaryMin = ?, salaryMax = ?, m_id = ? WHERE id = ?',
      [job_title, description, salaryMin, salaryMax, major_id, id]
    );
    return result;
  }

  static async delete(id) {
    const [result] = await pool.query('DELETE FROM Career WHERE id = ?', [id]);
    return result;
  }
}

module.exports = Career;