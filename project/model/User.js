const sequelize = require('../database/database');
const { DataTypes } = require('sequelize');

const UserModel = sequelize.define('User', {
  u_id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING },
  email: { type: DataTypes.STRING },
  password: { type: DataTypes.STRING },
  role: { type: DataTypes.STRING, defaultValue: 'student' },
}, {
  tableName: 'users',
  timestamps: false,
});

class User {
  static async create(userData) {
    const user = await UserModel.create(userData);
    return { insertId: user.u_id };
  }

  static async findById(id) {
    const user = await UserModel.findByPk(id);
    return user ? user.get() : null;
  }

  static async findByEmail(email) {
    const user = await UserModel.findOne({ where: { email } });
    return user ? user.get() : null;
  }

  static async getAll() {
    const users = await UserModel.findAll();
    return users.map((u) => u.get());
  }

  static async update(id, userData) {
    const [affectedRows] = await UserModel.update(userData, { where: { u_id: id } });
    return { affectedRows };
  }

  static async delete(id) {
    const affectedRows = await UserModel.destroy({ where: { u_id: id } });
    return { affectedRows };
  }
}

module.exports = User;
