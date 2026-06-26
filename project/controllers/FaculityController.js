const Faculty = require('../model/Faculity');

class FacultyController {
  static async create(req, res) {
    try {
      const { name, university_id } = req.body;

      if (!name || !university_id) {
        return res.status(400).json({ message: 'Name and university_id are required' });
      }

      const result = await Faculty.create({ name, university_id });
      res.status(201).json({ message: 'Faculty created successfully', facultyId: result.insertId });
    } catch (error) {
      res.status(500).json({ message: 'Error creating faculty', error: error.message });
    }
  }

  static async getAll(req, res) {
    try {
      const faculties = await Faculty.getAll();
      res.status(200).json(faculties);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching faculties', error: error.message });
    }
  }

  static async getById(req, res) {
    try {
      const { id } = req.params;
      const faculty = await Faculty.findById(id);

      if (!faculty) {
        return res.status(404).json({ message: 'Faculty not found' });
      }

      res.status(200).json(faculty);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching faculty', error: error.message });
    }
  }

  static async getByUniversity(req, res) {
    try {
      const { universityId } = req.params;
      const faculties = await Faculty.getByUniversity(universityId);
      res.status(200).json(faculties);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching faculties', error: error.message });
    }
  }

  static async update(req, res) {
    try {
      const { id } = req.params;
      const { name, university_id } = req.body;

      const faculty = await Faculty.findById(id);
      if (!faculty) {
        return res.status(404).json({ message: 'Faculty not found' });
      }

      await Faculty.update(id, { name, university_id });
      res.status(200).json({ message: 'Faculty updated successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Error updating faculty', error: error.message });
    }
  }

  static async delete(req, res) {
    try {
      const { id } = req.params;
      const faculty = await Faculty.findById(id);

      if (!faculty) {
        return res.status(404).json({ message: 'Faculty not found' });
      }

      await Faculty.delete(id);
      res.status(200).json({ message: 'Faculty deleted successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Error deleting faculty', error: error.message });
    }
  }
}

module.exports = FacultyController;
