const sequelize = require('../database/database');
const { DataTypes } = require('sequelize');

const ProgramModel = sequelize.define('Program', {
  p_id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING },
  uni_id: { type: DataTypes.INTEGER },
}, {
  tableName: 'program',
  timestamps: false,
});

class Program {
  static async create(programData) {
    const program = await ProgramModel.create({
      name: programData.name,
      uni_id: programData.university_id,
    });
    return { insertId: program.p_id };
  }

  static async findById(id) {
    const program = await ProgramModel.findByPk(id);
    return program ? program.get() : null;
  }

  static async getAll() {
    const programs = await ProgramModel.findAll();
    return programs.map((p) => p.get());
  }

  static async getByUniversity(universityId) {
    const programs = await ProgramModel.findAll({ where: { uni_id: universityId } });
    return programs.map((p) => p.get());
  }
}

module.exports = Program;