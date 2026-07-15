const Program = require('../model/Program');

class ProgramController {
  static async getAll(req, res) {
    try {
      const programs = await Program.getAll();
      res.status(200).json(programs);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching programs', error: error.message });
    }
  }

  static async getByUniversity(req, res) {
    try {
      const { universityId } = req.params;
      const programs = await Program.getByUniversity(universityId);
      res.status(200).json(programs);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching programs', error: error.message });
    }
  }
}

module.exports = ProgramController;