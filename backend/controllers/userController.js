const User = require('../models/User');
const { AppError } = require('../middleware/errorHandler');



exports.getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: users.length,
      users
    });
  } catch (error) {
    next(error);
  }
};



exports.blockUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      throw new AppError('User not found', 404);
    }

    if (user.role === 'admin') {
      throw new AppError('Cannot block an admin', 400);
    }

    user.isBlocked = true;
    await user.save();

    res.status(200).json({
      success: true,
      message: `User ${user.name} has been blocked`,
      user
    });
  } catch (error) {
    next(error);
  }
};



exports.unblockUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      throw new AppError('User not found', 404);
    }

    user.isBlocked = false;
    await user.save();

    res.status(200).json({
      success: true,
      message: `User ${user.name} has been unblocked`,
      user
    });
  } catch (error) {
    next(error);
  }
};



exports.updateProfile = async (req, res, next) => {
  try {
    const { name, image, skills, bio } = req.body;

    const updateData = {};
    if (name) updateData.name = name;
    if (image) updateData.image = image;
    if (skills) updateData.skills = skills;
    if (bio !== undefined) updateData.bio = bio;

    const user = await User.findByIdAndUpdate(
      req.user._id,
      updateData,
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      user
    });
  } catch (error) {
    next(error);
  }
};
