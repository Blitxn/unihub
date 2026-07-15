// controllers/ReviewController.js
const Review = require('../model/Review');
const User = require('../model/User');

class ReviewController {
  static async create(req, res) {
    try {
      const { university_id, rating, body } = req.body;

      // req.user is set by authenticateToken from the JWT — this is the
      // ONLY source of truth for who posted the review. The frontend
      // never gets to say "I am user X".
      const user_id = req.user.id;

      if (!university_id || !rating || !body) {
        return res.status(400).json({ message: 'university_id, rating, and body are required' });
      }

      if (rating < 1 || rating > 5) {
        return res.status(400).json({ message: 'rating must be between 1 and 5' });
      }

      const result = await Review.create({ user_id, university_id, rating, body });

      // Look up the reviewer's real name from the DB (JWT only carries id + email)
      const user = await User.findById(user_id);

      res.status(201).json({
        message: 'Review posted',
        review: {
          review_id: result.insertId,
          reviewer_name: user?.name || 'Unihub User',
          rating,
          body,
          created_at: new Date().toISOString(),
        },
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error creating review' });
    }
  }

  static async getByUniversity(req, res) {
    try {
      const reviews = await Review.getByUniversity(req.params.universityId);
      res.json(reviews);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error fetching reviews' });
    }
  }

  // Average rating + count for ONE university (shown on the detail page header)
  static async getRatingSummary(req, res) {
    try {
      const summary = await Review.getAverageByUniversity(req.params.universityId);
      res.json({
        avgRating: summary?.avgRating ? Number(summary.avgRating) : null,
        reviewCount: summary?.reviewCount || 0,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error fetching rating summary' });
    }
  }

  // Average rating + count for EVERY university (used to populate listing cards)
  static async getAllRatings(req, res) {
    try {
      const rows = await Review.getAllAverages();
      const ratings = rows.map((r) => ({
        university_id: r.university_id,
        avgRating: Number(r.avgRating),
        reviewCount: r.reviewCount,
      }));
      res.json(ratings);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error fetching ratings' });
    }
  }

  static async delete(req, res) {
    try {
      const review = await Review.findById(req.params.id);
      if (!review) {
        return res.status(404).json({ message: 'Review not found' });
      }

      // Only the review's author (or an admin) can delete it.
      // The JWT only carries id + email, so we check role from the DB.
      if (review.user_id !== req.user.id) {
        const requester = await User.findById(req.user.id);
        if (requester?.role !== 'admin') {
          return res.status(403).json({ message: 'Not authorized to delete this review' });
        }
      }

      const result = await Review.delete(req.params.id);
      if (result.affectedRows === 0) {
        return res.status(404).json({ message: 'Review not found' });
      }
      res.json({ message: 'Review deleted' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error deleting review' });
    }
  }
}

module.exports = ReviewController;