const sequelize = require('../database/database');
const { DataTypes } = require('sequelize');

const UniversityModel = sequelize.define('University', {
  uni_id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING },
  location: { type: DataTypes.STRING },
}, {
  tableName: 'University',
  timestamps: false,
});

class University {
  static async create(universityData) {
    const university = await UniversityModel.create(universityData);
    return { insertId: university.uni_id };
  }

  static async findById(id) {
    const university = await UniversityModel.findByPk(id);
    return university ? university.get() : null;
  }

  static async getAll() {
    const universities = await UniversityModel.findAll();
    return universities.map((u) => u.get());
  }

  static async update(id, universityData) {
    const [affectedRows] = await UniversityModel.update(universityData, { where: { uni_id: id } });
    return { affectedRows };
  }

  static async delete(id) {
    const affectedRows = await UniversityModel.destroy({ where: { uni_id: id } });
    return { affectedRows };
  }
}

module.exports = University;
