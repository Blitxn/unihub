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

  // Returns scholarships tied to a university via the new many-to-many join table
  static async getByUniversity(universityId) {
    const [rows] = await pool.query(
      `SELECT s.* FROM Scholarship s
       JOIN scholarship_university su ON s.id = su.scholarship_id
       WHERE su.uni_id = ?`,
      [universityId]
    );
    return rows;
  }

  // Get the list of university IDs + names linked to one scholarship
  static async getUniversitiesForScholarship(scholarshipId) {
    const [rows] = await pool.query(
      `SELECT u.uni_id, u.name FROM university u
       JOIN scholarship_university su ON u.uni_id = su.uni_id
       WHERE su.scholarship_id = ?`,
      [scholarshipId]
    );
    return rows;
  }

  // Get the list of requirement text rows linked to one scholarship
  static async getRequirementsForScholarship(scholarshipId) {
    const [rows] = await pool.query(
      'SELECT id, requirement_text FROM scholarship_requirement WHERE scholarship_id = ?',
      [scholarshipId]
    );
    return rows;
  }

  // Full detail: one scholarship + its universities + its requirements combined
  static async getFullDetail(scholarshipId) {
    const scholarship = await this.findById(scholarshipId);
    if (!scholarship) return null;

    const universities = await this.getUniversitiesForScholarship(scholarshipId);
    const requirements = await this.getRequirementsForScholarship(scholarshipId);

    return {
      ...scholarship,
      universities,
      requirements
    };
  }

  // Full list: every scholarship, each with its universities + requirements attached
  static async getAllWithDetails() {
    const scholarships = await this.getAll();

    const detailed = await Promise.all(
      scholarships.map(async (s) => {
        const universities = await this.getUniversitiesForScholarship(s.id);
        const requirements = await this.getRequirementsForScholarship(s.id);
        return { ...s, universities, requirements };
      })
    );

    return detailed;
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