const sequelize = require('../database/database');
const { DataTypes } = require('sequelize');

const CareerModel = sequelize.define('Career', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  job_title: { type: DataTypes.STRING },
  description: { type: DataTypes.TEXT },
  salaryMin: { type: DataTypes.DECIMAL },
  salaryMax: { type: DataTypes.DECIMAL },
  m_id: { type: DataTypes.INTEGER },
}, {
  tableName: 'Career',
  timestamps: false,
});

class Career {
  static async create(careerData) {
    const career = await CareerModel.create(careerData);
    return { insertId: career.id };
  }

  static async findById(id) {
    const career = await CareerModel.findByPk(id);
    return career ? career.get() : null;
  }

  static async getAll() {
    const careers = await CareerModel.findAll();
    return careers.map((c) => c.get());
  }

  static async getByMajor(majorId) {
    const careers = await CareerModel.findAll({ where: { m_id: majorId } });
    return careers.map((c) => c.get());
  }

  static async update(id, careerData) {
    return CareerModel.update(careerData, { where: { id } });
  }

  static async delete(id) {
    return CareerModel.destroy({ where: { id } });
  }
}

module.exports = Career;