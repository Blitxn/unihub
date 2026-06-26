const Career = require('../model/Career');

class CareerController {
  static async create(req, res) {
    try {
      const { job_title, description, salaryMin, salaryMax, major_id } = req.body;

      if (!job_title || !major_id) {
        return res.status(400).json({ message: 'job_title and major_id are required' });
      }

      const result = await Career.create({ job_title, description, salaryMin, salaryMax, major_id });
      res.status(201).json({ message: 'Career created successfully', careerId: result.insertId });
    } catch (error) {
      res.status(500).json({ message: 'Error creating career', error: error.message });
    }
  }

  static async getAll(req, res) {
    try {
      const careers = await Career.getAll();
      res.status(200).json(careers);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching careers', error: error.message });
    }
  }

  static async getById(req, res) {
    try {
      const { id } = req.params;
      const career = await Career.findById(id);

      if (!career) {
        return res.status(404).json({ message: 'Career not found' });
      }

      res.status(200).json(career);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching career', error: error.message });
    }
  }

  static async getByMajor(req, res) {
    try {
      const { majorId } = req.params;
      const careers = await Career.getByMajor(majorId);
      res.status(200).json(careers);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching careers', error: error.message });
    }
  }

  static async update(req, res) {
    try {
      const { id } = req.params;
      const { job_title, description, salaryMin, salaryMax, major_id } = req.body;

      const career = await Career.findById(id);
      if (!career) {
        return res.status(404).json({ message: 'Career not found' });
      }

      await Career.update(id, { job_title, description, salaryMin, salaryMax, major_id });
      res.status(200).json({ message: 'Career updated successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Error updating career', error: error.message });
    }
  }

  static async delete(req, res) {
    try {
      const { id } = req.params;
      const career = await Career.findById(id);

      if (!career) {
        return res.status(404).json({ message: 'Career not found' });
      }

      await Career.delete(id);
      res.status(200).json({ message: 'Career deleted successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Error deleting career', error: error.message });
    }
  }
}

module.exports = CareerController;
