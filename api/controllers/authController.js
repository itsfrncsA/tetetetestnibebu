import User from '../models/User.js';
import * as dbStore from '../config/db.js';

// Default in-memory superadmin
const memoryUsers = [
  {
    _id: 'user_superadmin_01',
    name: 'Super Admin',
    username: 'superadmin',
    email: 'admin@cpale.ph',
    password: 'qweqwe123',
    role: 'superadmin',
    createdAt: new Date().toISOString()
  }
];

// Ensure superadmin exists in MongoDB
export const initSuperadmin = async () => {
  if (!dbStore.isMongo()) return;
  try {
    const existing = await User.findOne({ 
      $or: [{ username: 'superadmin' }, { role: 'superadmin' }] 
    });
    if (!existing) {
      await User.create({
        name: 'Super Admin',
        username: 'superadmin',
        email: 'admin@cpale.ph',
        password: 'qweqwe123',
        role: 'superadmin'
      });
      console.log('Superadmin account initialized: superadmin / qweqwe123');
    }
  } catch (err) {
    console.error('Error initializing superadmin:', err.message);
  }
};

// @desc    Register a new user (student / examinee)
// @route   POST /api/auth/register
export const register = async (req, res) => {
  try {
    const { name, username, email, password } = req.body;

    if (!name || !username || !password) {
      return res.status(400).json({ success: false, message: 'Please provide name, username, and password.' });
    }

    const cleanUsername = username.trim().toLowerCase();

    if (dbStore.isMongo()) {
      const existing = await User.findOne({ username: cleanUsername });
      if (existing) {
        return res.status(400).json({ success: false, message: 'Username is already taken.' });
      }

      const user = await User.create({
        name: name.trim(),
        username: cleanUsername,
        email: email ? email.trim().toLowerCase() : `${cleanUsername}@student.cpale.ph`,
        password: password, // For simplicity in reviewer demo
        role: 'student'
      });

      return res.status(201).json({
        success: true,
        user: {
          id: user._id,
          name: user.name,
          username: user.username,
          email: user.email,
          role: user.role
        }
      });
    } else {
      const exists = memoryUsers.find(u => u.username === cleanUsername);
      if (exists) {
        return res.status(400).json({ success: false, message: 'Username is already taken.' });
      }

      const newUser = {
        _id: 'user_' + Date.now(),
        name: name.trim(),
        username: cleanUsername,
        email: email ? email.trim().toLowerCase() : `${cleanUsername}@student.cpale.ph`,
        password,
        role: 'student',
        createdAt: new Date().toISOString()
      };
      memoryUsers.push(newUser);

      return res.status(201).json({
        success: true,
        user: {
          id: newUser._id,
          name: newUser.name,
          username: newUser.username,
          email: newUser.email,
          role: newUser.role
        }
      });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Login user or superadmin
// @route   POST /api/auth/login
export const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ success: false, message: 'Please enter username and password.' });
    }

    const cleanUsername = username.trim().toLowerCase();

    // Check hardcoded superadmin fallback for instant reliability
    if ((cleanUsername === 'superadmin' || cleanUsername === 'admin' || cleanUsername === 'admin@cpale.ph') && password === 'qweqwe123') {
      return res.json({
        success: true,
        user: {
          id: 'superadmin_id',
          name: 'Super Admin',
          username: 'superadmin',
          email: 'admin@cpale.ph',
          role: 'superadmin'
        }
      });
    }

    let user;
    if (dbStore.isMongo()) {
      user = await User.findOne({
        $or: [{ username: cleanUsername }, { email: cleanUsername }]
      });
    } else {
      user = memoryUsers.find(u => u.username === cleanUsername || u.email === cleanUsername);
    }

    if (!user || user.password !== password) {
      return res.status(401).json({ success: false, message: 'Invalid username or password.' });
    }

    res.json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        username: user.username,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all users list (Superadmin only)
// @route   GET /api/auth/users
export const getAllUsers = async (req, res) => {
  try {
    let users = [];
    if (dbStore.isMongo()) {
      users = await User.find().select('-password').sort({ createdAt: -1 }).lean();
    } else {
      users = memoryUsers.map(({ password, ...u }) => u);
    }
    res.json({ success: true, count: users.length, data: users });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
