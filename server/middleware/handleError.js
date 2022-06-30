const ValidatorError = require('../Errors/ValidatorError')

module.exports = (error, req, res, next) => {
  if (error.name === 'ValidationError' || error.name === 'CastError') {
    error = new ValidatorError(error.message)
  }

  if (error.status === undefined) error.status = 500

  console.log(error)
  res.status(error.status).send({ error: error.message }).end()
}
