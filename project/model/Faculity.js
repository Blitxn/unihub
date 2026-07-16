const sequelize = require('../database/database');
const { DataTypes } = require('sequelize');

const FacultyModel = sequelize.define('Faculty', {
  p_id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING },
  uni_id: { type: DataTypes.INTEGER },
}, {
  tableName: 'Program',
  timestamps: false,
});

class Faculty {
  static async create(facultyData) {
    const faculty = await FacultyModel.create({
      name: facultyData.name,
      uni_id: facultyData.university_id,
    });
    return { insertId: faculty.p_id };
  }

  static async findById(id) {
    const faculty = await FacultyModel.findByPk(id);
    return faculty ? faculty.get() : null;
  }

  static async getAll() {
    const faculties = await FacultyModel.findAll();
    return faculties.map((f) => f.get());
  }

  static async getByUniversity(universityId) {
    const faculties = await FacultyModel.findAll({ where: { uni_id: universityId } });
    return faculties.map((f) => f.get());
  }

  static async update(id, facultyData) {
    return FacultyModel.update({
      name: facultyData.name,
      uni_id: facultyData.university_id,
    }, { where: { p_id: id } });
  }

  static async delete(id) {
    return FacultyModel.destroy({ where: { p_id: id } });
  }
}

module.exports = Faculty;
