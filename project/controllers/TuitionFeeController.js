const TuitionFee = require('../model/TuitionFee');

class TuitionFeeController {
  static async create(req, res) {
    try {
      const { amount, year, major_id, university_id } = req.body;

      if (!amount || !major_id || !university_id) {
        return res.status(400).json({ message: 'Amount, major_id, and university_id are required' });
      }

      const result = await TuitionFee.create({ amount, year, major_id, university_id });
      res.status(201).json({ message: 'Tuition fee created successfully', feeId: result.insertId });
    } catch (error) {
      res.status(500).json({ message: 'Error creating tuition fee', error: error.message });
    }
  }

  static async getAll(req, res) {
    try {
      const fees = await TuitionFee.getAll();
      res.status(200).json(fees);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching tuition fees', error: error.message });
    }
  }

  static async getById(req, res) {
    try {
      const { id } = req.params;
      const fee = await TuitionFee.findById(id);

      if (!fee) {
        return res.status(404).json({ message: 'Tuition fee not found' });
      }

      res.status(200).json(fee);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching tuition fee', error: error.message });
    }
  }

  static async getByMajor(req, res) {
    try {
      const { majorId } = req.params;
      const fees = await TuitionFee.getByMajor(majorId);
      res.status(200).json(fees);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching tuition fees', error: error.message });
    }
  }

  static async getByUniversity(req, res) {
    try {
      const { universityId } = req.params;
      const fees = await TuitionFee.getByUniversity(universityId);
      res.status(200).json(fees);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching tuition fees', error: error.message });
    }
  }

  static async update(req, res) {
    try {
      const { id } = req.params;
      const { amount, year, major_id, university_id } = req.body;

      const fee = await TuitionFee.findById(id);
      if (!fee) {
        return res.status(404).json({ message: 'Tuition fee not found' });
      }

      await TuitionFee.update(id, { amount, year, major_id, university_id });
      res.status(200).json({ message: 'Tuition fee updated successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Error updating tuition fee', error: error.message });
    }
  }

  static async delete(req, res) {
    try {
      const { id } = req.params;
      const fee = await TuitionFee.findById(id);

      if (!fee) {
        return res.status(404).json({ message: 'Tuition fee not found' });
      }

      await TuitionFee.delete(id);
      res.status(200).json({ message: 'Tuition fee deleted successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Error deleting tuition fee', error: error.message });
    }
  }
}

module.exports = TuitionFeeController;
