const jwt      = require('jsonwebtoken')

module.exports = {
  authentication(req, res, next) {
    const {
      apptoken,
      id
    } = req.headers

    jwt.verify(apptoken, process.env.SECRET, (err) => {
      if (err) {
        return res.status(403).json({
          message: 'Invalid token'
        })
      } else {
        const status = jwt.decode(apptoken, process.env.SECRET)
        if (status.id == id) {
          next()
        } else {
          return res.status(200).json({
            message: 'Your access id not accept'
          })
        }
      }
    })
  },

  authorization(req, res, next) {
    const {
      apptoken
    } = req.headers
    const status = jwt.decode(apptoken, process.env.SECRET)

    if (status.role == 'admin') {
      next()
    } else {
      return res.status(200).json({
        message: 'Your access role not match'
      })
    }
  }
}