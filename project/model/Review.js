const sequelize = require('../database/database');
const { DataTypes, QueryTypes } = require('sequelize');

const ReviewModel = sequelize.define('Review', {
  review_id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  user_id: { type: DataTypes.INTEGER },
  university_id: { type: DataTypes.INTEGER },
  rating: { type: DataTypes.INTEGER },
  body: { type: DataTypes.TEXT },
  created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
}, {
  tableName: 'reviews',
  timestamps: false,
});

class Review {
  static async create({ user_id, university_id, rating, body }) {
    const review = await ReviewModel.create({ user_id, university_id, rating, body });
    return { insertId: review.review_id };
  }

  static async findById(id) {
    const review = await ReviewModel.findByPk(id);
    return review ? review.get() : null;
  }

  // Joins to users so we always return the reviewer's current name,
  // never a name typed into the form.
  static async getByUniversity(universityId) {
    const rows = await sequelize.query(
      `SELECT
         r.review_id,
         r.rating,
         r.body,
         r.created_at,
         r.user_id,
         u.name AS reviewer_name
       FROM reviews r
       JOIN users u ON r.user_id = u.u_id
       WHERE r.university_id = ?
       ORDER BY r.created_at DESC`,
      { replacements: [universityId], type: QueryTypes.SELECT }
    );
    return rows;
  }

  static async delete(id) {
    const affectedRows = await ReviewModel.destroy({ where: { review_id: id } });
    return { affectedRows };
  }

  static async getAverageByUniversity(universityId) {
    const rows = await sequelize.query(
      `SELECT AVG(rating) AS avgRating, COUNT(*) AS reviewCount
       FROM reviews
       WHERE university_id = ?`,
      { replacements: [universityId], type: QueryTypes.SELECT }
    );
    return rows[0];
  }

  static async getAllAverages() {
    const rows = await sequelize.query(
      `SELECT university_id, AVG(rating) AS avgRating, COUNT(*) AS reviewCount
       FROM reviews
       GROUP BY university_id`,
      { type: QueryTypes.SELECT }
    );
    return rows;
  }
}

module.exports = Review;