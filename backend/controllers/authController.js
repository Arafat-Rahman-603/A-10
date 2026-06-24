const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { AppError } = require('../middleware/errorHandler');


const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '7d'
  });
};


const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
  maxAge: 7 * 24 * 60 * 60 * 1000 
};



exports.register = async (req, res, next) => {
  try {
    const { name, email, password, role, image } = req.body;

    
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new AppError('User already exists with this email', 400);
    }

    
    if (password.length < 6) {
      throw new AppError('Password must be at least 6 characters', 400);
    }
    if (!/[A-Z]/.test(password)) {
      throw new AppError('Password must contain at least one uppercase letter', 400);
    }
    if (!/[a-z]/.test(password)) {
      throw new AppError('Password must contain at least one lowercase letter', 400);
    }

    
    let userRole = role || 'collaborator';
    if (email === process.env.ADMIN_EMAIL) {
      userRole = 'admin';
    }

    const user = await User.create({
      name,
      email,
      password,
      role: userRole,
      image: image || undefined
    });

    const token = generateToken(user._id);

    res.cookie('token', token, cookieOptions);

    res.status(201).json({
      success: true,
      message: 'Registration successful',
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        image: user.image,
        role: user.role
      },
      token
    });
  } catch (error) {
    next(error);
  }
};



exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      throw new AppError('Please provide email and password', 400);
    }

    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      throw new AppError('Invalid email or password', 401);
    }

    if (user.isBlocked) {
      throw new AppError('Your account has been blocked. Contact admin.', 403);
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      throw new AppError('Invalid email or password', 401);
    }

    const token = generateToken(user._id);

    res.cookie('token', token, cookieOptions);

    res.status(200).json({
      success: true,
      message: 'Login successful',
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        image: user.image,
        role: user.role
      },
      token
    });
  } catch (error) {
    next(error);
  }
};



exports.googleAuth = async (req, res, next) => {
  try {
    const { name, email, image, role } = req.body;

    if (!email) {
      throw new AppError('Email is required', 400);
    }

    let user = await User.findOne({ email });

    if (user && user.isBlocked) {
      throw new AppError('Your account has been blocked. Contact admin.', 403);
    }

    if (!user) {
      
      let userRole = role || 'collaborator';
      if (email === process.env.ADMIN_EMAIL) {
        userRole = 'admin';
      }

      user = await User.create({
        name: name || email.split('@')[0],
        email,
        image,
        role: userRole,
        provider: 'google'
      });
    }

    const token = generateToken(user._id);

    res.cookie('token', token, cookieOptions);

    res.status(200).json({
      success: true,
      message: 'Login successful',
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        image: user.image,
        role: user.role
      },
      token
    });
  } catch (error) {
    next(error);
  }
};



exports.logout = async (req, res) => {
  res.cookie('token', '', {
    httpOnly: true,
    expires: new Date(0)
  });

  res.status(200).json({
    success: true,
    message: 'Logged out successfully'
  });
};



exports.getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);

    res.status(200).json({
      success: true,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        image: user.image,
        role: user.role,
        skills: user.skills,
        bio: user.bio,
        createdAt: user.createdAt
      }
    });
  } catch (error) {
    next(error);
  }
};
