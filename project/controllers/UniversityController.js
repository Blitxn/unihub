const University = require('../model/University');

class UniversityController {
  static async create(req, res) {
    try {
      const { name, location } = req.body;

      if (!name || !location) {
        return res.status(400).json({ message: 'Name and location are required' });
      }

      const result = await University.create({ name, location });
      res.status(201).json({ message: 'University created successfully', universityId: result.insertId });
    } catch (error) {
      res.status(500).json({ message: 'Error creating university', error: error.message });
    }
  }

  static async getAll(req, res) {
    try {
      const universities = await University.getAll();
      res.status(200).json(universities);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching University', error: error.message });
    }
  }

  static async getById(req, res) {
    try {
      const { id } = req.params;
      const university = await University.findById(id);

      if (!university) {
        return res.status(404).json({ message: 'University not found' });
      }

      res.status(200).json(university);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching university', error: error.message });
    }
  }

  static async update(req, res) {
    try {
      const { id } = req.params;
      const { name, location } = req.body;

      const university = await University.findById(id);
      if (!university) {
        return res.status(404).json({ message: 'University not found' });
      }

      await University.update(id, { name, location });
      res.status(200).json({ message: 'University updated successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Error updating university', error: error.message });
    }
  }

  static async delete(req, res) {
    try {
      const { id } = req.params;
      const university = await University.findById(id);

      if (!university) {
        return res.status(404).json({ message: 'University not found' });
      }

      await University.delete(id);
      res.status(200).json({ message: 'University deleted successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Error deleting university', error: error.message });
    }
  }
}

module.exports = UniversityController;
