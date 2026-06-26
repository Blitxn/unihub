const Scholarship = require('../model/Scholarship');

class ScholarshipController {
  static async create(req, res) {
    try {
      const { name, provider, amount, eligibitily, deadline, type, university_id } = req.body;

      if (!name || !university_id) {
        return res.status(400).json({ message: 'Name and university_id are required' });
      }

      const result = await Scholarship.create({ name, provider, amount, eligibitily, deadline, type, university_id });
      res.status(201).json({ message: 'Scholarship created successfully', scholarshipId: result.insertId });
    } catch (error) {
      res.status(500).json({ message: 'Error creating scholarship', error: error.message });
    }
  }

  static async getAll(req, res) {
    try {
      const scholarships = await Scholarship.getAll();
      res.status(200).json(scholarships);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching scholarships', error: error.message });
    }
  }

  static async getById(req, res) {
    try {
      const { id } = req.params;
      const scholarship = await Scholarship.findById(id);

      if (!scholarship) {
        return res.status(404).json({ message: 'Scholarship not found' });
      }

      res.status(200).json(scholarship);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching scholarship', error: error.message });
    }
  }

  static async getByUniversity(req, res) {
    try {
      const { universityId } = req.params;
      const scholarships = await Scholarship.getByUniversity(universityId);
      res.status(200).json(scholarships);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching scholarships', error: error.message });
    }
  }

  static async update(req, res) {
    try {
      const { id } = req.params;
      const { name, provider, amount, eligibitily, deadline, type, university_id } = req.body;

      const scholarship = await Scholarship.findById(id);
      if (!scholarship) {
        return res.status(404).json({ message: 'Scholarship not found' });
      }

      await Scholarship.update(id, { name, provider, amount, eligibitily, deadline, type, university_id });
      res.status(200).json({ message: 'Scholarship updated successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Error updating scholarship', error: error.message });
    }
  }

  static async delete(req, res) {
    try {
      const { id } = req.params;
      const scholarship = await Scholarship.findById(id);

      if (!scholarship) {
        return res.status(404).json({ message: 'Scholarship not found' });
      }

      await Scholarship.delete(id);
      res.status(200).json({ message: 'Scholarship deleted successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Error deleting scholarship', error: error.message });
    }
  }
}

module.exports = ScholarshipController;
