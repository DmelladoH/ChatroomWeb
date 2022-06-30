
class ValidatorError extends Error {
  constructor (message) {
    super(message)
    this.name = 'ValidatorError'
    this.status = 400
  }
}

module.exports = ValidatorError
