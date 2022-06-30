const jwt = require('jsonwebtoken')
const UnauthorizedError = require('../Errors/UnauthorizedError')

module.exports = (request, response, next) => {
  const auth = request.get('authorization')
  let token = null

  if (auth && auth.toLowerCase().startsWith('bearer')) {
    token = auth.split(' ')[1]
  }

  try {
    const decodedToken = jwt.verify(token, process.env.SECRET)

    // if (!token || !decodedToken.id) {
    //   return next(new UnauthorizedError('unauthorized user'))
    // }

    const { id: userId } = decodedToken
    request.userId = userId
  } catch (err) {
    if (err.name === 'JsonWebTokenError') {
      next(new UnauthorizedError('unauthorized user'))
    } else {
      next(err)
    }
  }

  next()
}
