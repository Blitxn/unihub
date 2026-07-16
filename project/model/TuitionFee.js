const sequelize = require('../database/database');
const { DataTypes, QueryTypes } = require('sequelize');

const TuitionFeeModel = sequelize.define('TuitionFee', {
  fee_id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  amount: { type: DataTypes.DECIMAL },
  academicYear: { type: DataTypes.STRING },
  m_id: { type: DataTypes.INTEGER },
}, {
  tableName: 'tuitionfee',
  timestamps: false,
});

class TuitionFee {
  static async create(feeData) {
    const fee = await TuitionFeeModel.create(feeData);
    return { insertId: fee.fee_id };
  }

  static async findById(id) {
    const fee = await TuitionFeeModel.findByPk(id);
    return fee ? fee.get() : null;
  }

  static async getAll() {
    const fees = await TuitionFeeModel.findAll();
    return fees.map((f) => f.get());
  }

  static async getByMajor(majorId) {
    const fees = await TuitionFeeModel.findAll({ where: { m_id: majorId } });
    return fees.map((f) => f.get());
  }

  static async getByUniversity(universityId) {
    const rows = await sequelize.query(
      `SELECT tf.* FROM tuitionfee tf
       JOIN Major m ON tf.m_id = m.m_id
       WHERE m.uni_id = ?`,
      { replacements: [universityId], type: QueryTypes.SELECT }
    );
    return rows;
  }

  static async update(id, feeData) {
    const [affectedRows] = await TuitionFeeModel.update(feeData, { where: { fee_id: id } });
    return { affectedRows };
  }

  static async delete(id) {
    const affectedRows = await TuitionFeeModel.destroy({ where: { fee_id: id } });
    return { affectedRows };
  }
}

module.exports = TuitionFee;
