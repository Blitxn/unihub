const sequelize = require('../database/database');
const { DataTypes, QueryTypes } = require('sequelize');

const ScholarshipModel = sequelize.define('Scholarship', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING },
  provider: { type: DataTypes.STRING },
  amount: { type: DataTypes.DECIMAL },
  eligibitily: { type: DataTypes.STRING },
  deadline: { type: DataTypes.DATE },
  type: { type: DataTypes.STRING },
  uni_id: { type: DataTypes.INTEGER },
}, {
  tableName: 'Scholarship',
  timestamps: false,
});

class Scholarship {
  static async create(scholarshipData) {
    const scholarship = await ScholarshipModel.create(scholarshipData);
    return { insertId: scholarship.id };
  }

  static async findById(id) {
    const scholarship = await ScholarshipModel.findByPk(id);
    return scholarship ? scholarship.get() : null;
  }

  static async getAll() {
    const scholarships = await ScholarshipModel.findAll();
    return scholarships.map((s) => s.get());
  }

  // Returns scholarships tied to a university via the new many-to-many join table
  static async getByUniversity(universityId) {
    const rows = await sequelize.query(
      `SELECT s.* FROM Scholarship s
       JOIN scholarship_university su ON s.id = su.scholarship_id
       WHERE su.uni_id = ?`,
      { replacements: [universityId], type: QueryTypes.SELECT }
    );
    return rows;
  }

  // Get the list of university IDs + names linked to one scholarship
  static async getUniversitiesForScholarship(scholarshipId) {
    const rows = await sequelize.query(
      `SELECT u.uni_id, u.name FROM university u
       JOIN scholarship_university su ON u.uni_id = su.uni_id
       WHERE su.scholarship_id = ?`,
      { replacements: [scholarshipId], type: QueryTypes.SELECT }
    );
    return rows;
  }

  // Get the list of requirement text rows linked to one scholarship
  static async getRequirementsForScholarship(scholarshipId) {
    const rows = await sequelize.query(
      'SELECT id, requirement_text FROM scholarship_requirement WHERE scholarship_id = ?',
      { replacements: [scholarshipId], type: QueryTypes.SELECT }
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
    const [affectedRows] = await ScholarshipModel.update(scholarshipData, { where: { id } });
    return { affectedRows };
  }

  static async delete(id) {
    const affectedRows = await ScholarshipModel.destroy({ where: { id } });
    return { affectedRows };
  }
}

module.exports = Scholarship;