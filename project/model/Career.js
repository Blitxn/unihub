const pool = require('../database/database');

class Career {
  static async create(careerData) {
    const { title, description, salary_range, industry } = careerData;
    const [result] = await pool.query(
      'INSERT INTO careers (title, description, salary_range, industry) VALUES (?, ?, ?, ?)',
      [title, description, salary_range, industry]
    );
    return result;
  }

  static async findById(id) {
    const [rows] = await pool.query('SELECT * FROM careers WHERE id = ?', [id]);
    return rows[0];
  }

  static async getAll() {
    const [rows] = await pool.query('SELECT * FROM careers');
    return rows;
  }

  static async update(id, careerData) {
    const { title, description, salary_range, industry } = careerData;
    const [result] = await pool.query(
      'UPDATE careers SET title = ?, description = ?, salary_range = ?, industry = ? WHERE id = ?',
      [title, description, salary_range, industry, id]
    );
    return result;
  }

  static async delete(id) {
    const [result] = await pool.query('DELETE FROM careers WHERE id = ?', [id]);
    return result;
  }
}

module.exports = Career;
