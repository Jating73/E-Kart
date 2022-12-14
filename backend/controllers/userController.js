const generateToken = require('../utils/generateToken')
const User = require('../models/userModel')

// Auth user & get token
// POST /api/users/login
// Access  Public
const authUser = async (req, res) => {
  const { email, password } = req.body

  const user = await User.findOne({ email })

  if (user && (await user.matchPassword(password))) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      token: generateToken(user._id),
    })
  } else {
    res.status(401).json({
      message: "Invalid email or password"
    });
    // throw new Error('Invalid email or password')
  }
}

// Register a new user
// POST /api/users
// Access  Public
const registerUser = async (req, res) => {
  const { name, email, password } = req.body

  const userExists = await User.findOne({ email })

  if (userExists) {
    res.status(400).json({
      message:"User already exists"
    });
    // throw new Error('User already exists')
  }

  const user = await User.create({
    name,
    email,
    password,
  })

  if (user) {
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      token: generateToken(user._id),
    })
  } else {
    res.status(400).json({
      message:"Invalid user data"
    })
    // throw new Error('Invalid user data')
  }
}

// Get user profile
// GET /api/users/profile
// Access  Private
const getUserProfile = async (req, res) => {
  const user = await User.findById(req.user._id)

  if (user) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
    })
  } else {
    res.status(404)
    res.json({
      message:"User not found"
    })
  }
}

// Update user profile
// PUT /api/users/profile
// Access  Private
const updateUserProfile = async (req, res) => {
  const user = await User.findById(req.user._id)

  if (user) {
    user.name = req.body.name || user.name
    user.email = req.body.email || user.email
    if (req.body.password) {
      user.password = req.body.password
    }

    const updatedUser = await user.save()

    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      isAdmin: updatedUser.isAdmin,
      token: generateToken(updatedUser._id),
    })
  } else {
    res.status(404).json({
      message:"User not found"
    })
    // throw new Error('User not found')
  }
}

// Get all users
// GET /api/users
// Access  Private/Admin
const getUsers = async (req, res) => {
  const users = await User.find({})
  res.json(users)
}

// Delete user
// DELETE /api/users/:id
// Access  Private/Admin
const deleteUser = async (req, res) => {
  const user = await User.findById(req.params.id)

  if (user) {
    await user.remove()
    res.json({ message: 'User removed' })
  } else {
    res.status(404).json({
      message:"User not found"
    })
    // throw new Error('User not found')
  }
}

// Get user by ID
// GET /api/users/:id
// Access  Private/Admin
const getUserById = async (req, res) => {
  const user = await User.findById(req.params.id).select('-password')

  if (user) {
    res.json(user)
  } else {
    res.status(404).json({
      message: "User not found"
    })
    // throw new Error('User not found')
  }
}

// Update user
// PUT /api/users/:id
// Access  Private/Admin
const updateUser = async (req, res) => {
  const user = await User.findById(req.params.id)

  if (user) {
    user.name = req.body.name || user.name
    user.email = req.body.email || user.email
    user.isAdmin = req.body.isAdmin

    const updatedUser = await user.save()

    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      isAdmin: updatedUser.isAdmin,
    })
  } else {
    res.status(404).json({
      message: "User not found"
    });
    // throw new Error('User not found')
  }
}

module.exports = {
  authUser,
  registerUser,
  getUserProfile,
  updateUserProfile,
  getUsers,
  deleteUser,
  getUserById,
  updateUser,
}
