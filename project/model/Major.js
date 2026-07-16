const sequelize = require('../database/database');
const { DataTypes } = require('sequelize');

const MajorModel = sequelize.define('Major', {
  m_id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING },
  duration: { type: DataTypes.STRING },
  p_id: { type: DataTypes.INTEGER },
  uni_id: { type: DataTypes.INTEGER },
}, {
  tableName: 'Major',
  timestamps: false,
});

class Major {
  static async create(majorData) {
    const major = await MajorModel.create({
      name: majorData.name,
      duration: majorData.duration,
      p_id: majorData.program_id,
      uni_id: majorData.university_id,
    });
    return { insertId: major.m_id };
  }

  static async findById(id) {
    const major = await MajorModel.findByPk(id);
    return major ? major.get() : null;
  }

  static async getAll() {
    const majors = await MajorModel.findAll();
    return majors.map((m) => m.get());
  }

  static async getByUniversity(universityId) {
    const majors = await MajorModel.findAll({ where: { uni_id: universityId } });
    return majors.map((m) => m.get());
  }

  static async update(id, majorData) {
    return MajorModel.update({
      name: majorData.name,
      duration: majorData.duration,
      p_id: majorData.program_id,
      uni_id: majorData.university_id,
    }, { where: { m_id: id } });
  }

  static async delete(id) {
    return MajorModel.destroy({ where: { m_id: id } });
  }
}

module.exports = Major;
