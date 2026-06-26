const pool = require('../database/database');

class FacultyController {
  static async create(req, res) {
    try {
      const { name, description, university_id } = req.body;

      if (!name || !university_id) {
        return res.status(400).json({ message: 'Name and university_id are required' });
      }

      const [result] = await pool.query(
        'INSERT INTO faculties (name, description, university_id) VALUES (?, ?, ?)',
        [name, description, university_id]
      );
      res.status(201).json({ message: 'Faculty created successfully', facultyId: result.insertId });
    } catch (error) {
      res.status(500).json({ message: 'Error creating faculty', error: error.message });
    }
  }

  static async getAll(req, res) {
    try {
      const [faculties] = await pool.query('SELECT * FROM faculties');
      res.status(200).json(faculties);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching faculties', error: error.message });
    }
  }

  static async getById(req, res) {
    try {
      const { id } = req.params;
      const [faculties] = await pool.query('SELECT * FROM faculties WHERE id = ?', [id]);

      if (faculties.length === 0) {
        return res.status(404).json({ message: 'Faculty not found' });
      }

      res.status(200).json(faculties[0]);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching faculty', error: error.message });
    }
  }

  static async getByUniversity(req, res) {
    try {
      const { universityId } = req.params;
      const [faculties] = await pool.query('SELECT * FROM faculties WHERE university_id = ?', [universityId]);
      res.status(200).json(faculties);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching faculties', error: error.message });
    }
  }

  static async update(req, res) {
    try {
      const { id } = req.params;
      const { name, description, university_id } = req.body;

      const [faculties] = await pool.query('SELECT * FROM faculties WHERE id = ?', [id]);
      if (faculties.length === 0) {
        return res.status(404).json({ message: 'Faculty not found' });
      }

      await pool.query('UPDATE faculties SET name = ?, description = ?, university_id = ? WHERE id = ?', [name, description, university_id, id]);
      res.status(200).json({ message: 'Faculty updated successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Error updating faculty', error: error.message });
    }
  }

  static async delete(req, res) {
    try {
      const { id } = req.params;
      const [faculties] = await pool.query('SELECT * FROM faculties WHERE id = ?', [id]);

      if (faculties.length === 0) {
        return res.status(404).json({ message: 'Faculty not found' });
      }

      await pool.query('DELETE FROM faculties WHERE id = ?', [id]);
      res.status(200).json({ message: 'Faculty deleted successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Error deleting faculty', error: error.message });
    }
  }
}

module.exports = FacultyController;
