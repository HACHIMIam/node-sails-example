/* global sails,Customer */
const jwt = require('jwt-simple')
module.exports = (req, res, next) => {
  let token = req.headers.authorization
  let payload = jwt.decode(token, sails.config.CONSTANTS.JWT_SECRET)
  User.findOne({id: payload.sub}).exec((err, customer) => {
    if (err) return res.negotiate(err)
    if (!customer) return res.send(401)
    next()
  })
}