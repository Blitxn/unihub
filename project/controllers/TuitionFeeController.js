const TuitionFee = require('../model/TuitionFee');

class TuitionFeeController {
  static async create(req, res) {
    try {
      const { amount, academicYear, major_id } = req.body;

      if (!amount || !academicYear || !major_id) {
        return res.status(400).json({ message: 'amount, academicYear, and major_id are required' });
      }

      const result = await TuitionFee.create({ amount, academicYear, major_id });
      res.status(201).json({ message: 'Tuition fee created', id: result.insertId });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error creating tuition fee' });
    }
  }

  static async getAll(req, res) {
    try {
      const fees = await TuitionFee.getAll();
      res.json(fees);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error fetching tuition fees' });
    }
  }

  static async getById(req, res) {
    try {
      const fee = await TuitionFee.findById(req.params.id);
      if (!fee) return res.status(404).json({ message: 'Tuition fee not found' });
      res.json(fee);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error fetching tuition fee' });
    }
  }

  static async getByMajor(req, res) {
    try {
      const fees = await TuitionFee.getByMajor(req.params.majorId);
      res.json(fees);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error fetching tuition fees by major' });
    }
  }

  static async getByUniversity(req, res) {
    try {
      const fees = await TuitionFee.getByUniversity(req.params.universityId);
      res.json(fees);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error fetching tuition fees by university' });
    }
  }

  static async update(req, res) {
    try {
      const { amount, academicYear, major_id } = req.body;
      const result = await TuitionFee.update(req.params.id, { amount, academicYear, major_id });

      if (result.affectedRows === 0) {
        return res.status(404).json({ message: 'Tuition fee not found' });
      }
      res.json({ message: 'Tuition fee updated' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error updating tuition fee' });
    }
  }

  static async delete(req, res) {
    try {
      const result = await TuitionFee.delete(req.params.id);
      if (result.affectedRows === 0) {
        return res.status(404).json({ message: 'Tuition fee not found' });
      }
      res.json({ message: 'Tuition fee deleted' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error deleting tuition fee' });
    }
  }
}

module.exports = TuitionFeeController;