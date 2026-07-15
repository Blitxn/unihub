// model/Review.js
const pool = require('../database/database');

class Review {
  static async create({ user_id, university_id, rating, body }) {
    const [result] = await pool.query(
      'INSERT INTO reviews (user_id, university_id, rating, body) VALUES (?, ?, ?, ?)',
      [user_id, university_id, rating, body]
    );
    return result;
  }

  static async findById(id) {
    const [rows] = await pool.query(
      'SELECT * FROM reviews WHERE review_id = ?',
      [id]
    );
    return rows[0];
  }

  // Joins to users so we always return the reviewer's current name,
  // never a name typed into the form.
  static async getByUniversity(universityId) {
    const [rows] = await pool.query(
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
      [universityId]
    );
    return rows;
  }

  static async delete(id) {
    const [result] = await pool.query(
      'DELETE FROM reviews WHERE review_id = ?',
      [id]
    );
    return result;
  }

  // Average rating + review count for ONE university (used on the detail page)
  static async getAverageByUniversity(universityId) {
    const [rows] = await pool.query(
      `SELECT AVG(rating) AS avgRating, COUNT(*) AS reviewCount
       FROM reviews
       WHERE university_id = ?`,
      [universityId]
    );
    return rows[0];
  }

  // Average rating + review count for EVERY university in one query
  // (used to populate the star ratings on the university listing cards)
  static async getAllAverages() {
    const [rows] = await pool.query(
      `SELECT university_id, AVG(rating) AS avgRating, COUNT(*) AS reviewCount
       FROM reviews
       GROUP BY university_id`
    );
    return rows;
  }
}

module.exports = Review;