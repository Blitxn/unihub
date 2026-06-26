const Major = require('../model/Major');

class MajorController {
  static async create(req, res) {
    try {
      const { name, duration, program_id, university_id } = req.body;

      if (!name || !university_id || !program_id || !duration) {
        return res.status(400).json({ message: 'Name and university_id are required' });
      }

      const result = await Major.create({ name, duration, program_id, university_id });
      res.status(201).json({ message: 'Major created successfully', majorId: result.insertId });
    } catch (error) {
      res.status(500).json({ message: 'Error creating major', error: error.message });
    }
  }

  static async getAll(req, res) {
    try {
      const majors = await Major.getAll();
      res.status(200).json(majors);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching majors', error: error.message });
    }
  }

  static async getById(req, res) {
    try {
      const { id } = req.params;
      const major = await Major.findById(id);

      if (!major) {
        return res.status(404).json({ message: 'Major not found' });
      }

      res.status(200).json(major);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching major', error: error.message });
    }
  }

  static async getByUniversity(req, res) {
    try {
      const { universityId } = req.params;
      const majors = await Major.getByUniversity(universityId);
      res.status(200).json(majors);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching majors', error: error.message });
    }
  }

  static async update(req, res) {
    try {
      const { id } = req.params;
      const { name, duration, program_id, university_id } = req.body;

      const major = await Major.findById(id);
      if (!major) {
        return res.status(404).json({ message: 'Major not found' });
      }

      await Major.update(id, { name, duration, program_id, university_id });
      res.status(200).json({ message: 'Major updated successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Error updating major', error: error.message });
    }
  }

  static async delete(req, res) {
    try {
      const { id } = req.params;
      const major = await Major.findById(id);

      if (!major) {
        return res.status(404).json({ message: 'Major not found' });
      }

      await Major.delete(id);
      res.status(200).json({ message: 'Major deleted successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Error deleting major', error: error.message });
    }
  }
}

module.exports = MajorController;
