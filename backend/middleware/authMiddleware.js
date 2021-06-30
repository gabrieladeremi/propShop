import jwt from 'jsonwebtoken'
import User from '../model/userModel.js'
import expressAsyncHandler from 'express-async-handler'

const protect = expressAsyncHandler(async (req, res, next) => {
  let token
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1]

      const decoded = jwt.verify(token, process.env.JWT_SECRET)
      console.log('decoded', decoded)

      req.user = await User.findById(decoded.id).select('-password')
      console.log(`we done come`)
      next()
    } catch (error) {
      console.error('the error:', error)
      res.status(401)
      throw new Error('Not authorized, token failed')
    }
  }

  if (!token) {
    res.status(401)
    throw new Error('Not authorized, invalid token')
  }
})

export default protect
