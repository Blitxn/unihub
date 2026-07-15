const User = require('../model/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'unihub_jwt_secret';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '1d';

function sanitizeUser(user) {
  if (!user) {
    return null;
  }

  return {
    id: user.u_id,
    name: user.name,
    email: user.email,
    role: user.role,
    created_at: user.created_at,
    updated_at: user.updated_at,
  };
}

function createToken(user) {
  return jwt.sign(
    { id: user.u_id },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN }
  );
}


class UserController {
  static async register(req, res) {
    try {
      const { name, email, password, role } = req.body;

      if (!name || !email || !password || !role) {
        return res.status(400).json({ message: 'Missing required fields' });
      }

      const existingUser = await User.findByEmail(email);
      if (existingUser) {
        return res.status(400).json({ message: 'Email already registered' });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const result = await User.create({ name, email, password: hashedPassword, role });

      const createdUser = await User.findById(result.insertId);
      const token = createToken(createdUser);

      res.status(201).json({
        message: 'User registered successfully',
        token,
      });
    } catch (error) {
      res.status(500).json({ message: 'Error registering user', error: error.message });
    }
  }

  static async login(req, res) {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({ message: 'Email and password required' });
      }

      const user = await User.findByEmail(email);
      if (!user) {
        return res.status(401).json({ message: 'Invalid email or password' });
      }

      const passwordMatches = await bcrypt.compare(password, user.password);
      const legacyPasswordMatches = user.password === password;

      if (!passwordMatches && !legacyPasswordMatches) {
        return res.status(401).json({ message: 'Invalid email or password' });
      }

      if (legacyPasswordMatches && !passwordMatches) {
        const hashedPassword = await bcrypt.hash(password, 10);
        await User.updatePassword(user.u_id, hashedPassword);
        user.password = hashedPassword;
      }

      const token = createToken(user);
      
      res.status(200).json({
        message: 'Login successful',
        token,
      });
    } catch (error) {
      res.status(500).json({ message: 'Error logging in', error: error.message });
    }
  }

  static async getAll(req, res) {
    try {
      const users = await User.getAll();
      res.status(200).json(users.map(sanitizeUser));
    } catch (error) {
      res.status(500).json({ message: 'Error fetching users', error: error.message });
    }
  }

  static async getById(req, res) {
    try {
      const { id } = req.params;
      const user = await User.findById(id);

      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      res.status(200).json(sanitizeUser(user));
    } catch (error) {
      res.status(500).json({ message: 'Error fetching user', error: error.message });
    }
  }

  static async update(req, res) {
    try {
      const { id } = req.params;
      const { name, email, role } = req.body;

      const user = await User.findById(id);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      await User.update(id, { name, email, role });
      res.status(200).json({ message: 'User updated successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Error updating user', error: error.message });
    }
  }

  static async delete(req, res) {
    try {
      const { id } = req.params;
      const user = await User.findById(id);

      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      await User.delete(id);
      res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Error deleting user', error: error.message });
    }
  }
}

module.exports = UserController;
