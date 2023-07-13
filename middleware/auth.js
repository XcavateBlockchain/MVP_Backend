import { User } from '../models/user.model.js'
import jwt from 'jsonwebtoken'

export const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')? req.header('Authorization').replace('Bearer ', '') : ''

    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    const user = await User.findOne({
      _id: decoded._id, 'tokens.token': token
    })

    if (!user) {
      throw new Error()
    }

    req.user = user
    next()
  } catch (err) {
    return res.status(HTTP_STATUS_CODES.UNAUTHORIZED).send({
      error: ERROR_MESSAGES.UNAUTHORIZED,
      data: null,
    })
  }
}

export const decodeToken = async (token) => {
  token = token? token.replace('Bearer ', '') : ''

  const decoded = jwt.verify(token, process.env.JWT_SECRET)
  const user = await User.findOne({
    _id: decoded._id,
    'tokens.token': token
  })

  return user
}
