import expressAsyncHandler from 'express-async-handler'
import User from '../model/userModel.js'
import generateToken from '../utils/generateToken.js'

//@desc     Auth user & login
//@route    /api/users/login
//@access   public
const authUser = expressAsyncHandler(async (req, res) => {
  const { email, password } = req.body

  const user = await User.findOne({ email: email })

  if (user && (await user.matchPassword(password))) {
    res.json({
      id: user.id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      token: generateToken(user._id),
    })
  } else {
    res.status(401)
    throw new Error('invalid email or password')
  }
})

//@desc     Register user and generate token
//@route    /api/users
//@access   public
const registerUser = expressAsyncHandler(async (req, res) => {
  const { name, email, password } = req.body

  const userExist = await User.findOne({ email: email })

  if (userExist) {
    res.status(400)
    throw new Error('User already exist')
  }

  const user = await User.create({
    name,
    email,
    password,
  })

  if (user) {
    res.status(200).json({
      id: user.id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      token: generateToken(user._id),
    })
  } else {
    res.status(400)
    throw new Error('Invalid user credentials')
  }
})

//@desc     User profile
//@route    /api/users/profile
//@access   private
const getUserProfile = expressAsyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id)

  if (user) {
    res.json({
      id: user.id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
    })
  } else {
    res.send(404)
    throw new Error('User not found')
  }
})

//@desc     update user profile
//@route    /api/users/profile
//@access   private
const updateUserProfile = expressAsyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id)

  if (user) {
    ;(user.name = req.body.name || user.name),
      (user.email = req.body.email || user.email)
    req.body.password ? (user.password = req.body.password) : user.password

    const updatedUser = await user.save()

    res.json({
      id: updatedUser.id,
      name: updatedUser.name,
      email: updatedUser.email,
      isAdmin: updatedUser.isAdmin,
      token: generateToken(updatedUser._id),
    })
  } else {
    res.send(404)
    throw new Error('User not found')
  }
})

export { authUser, registerUser, getUserProfile, updateUserProfile }
