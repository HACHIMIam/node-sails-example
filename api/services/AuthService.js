const jwt = require('jwt-simple')
const FB = require('fb')
const moment = require('moment')
module.exports = {
  /**
 * login a user user with facebook
 * @param {string} token- the facebook-token
 */
/* global user,sails */
  facebookAuth (token, callback) {
    FB.api('me', {fields: ['name', 'email'], access_token: token}, response => {
      if (!response || response.error) {
        callback(!response ? 'error occurred' : response.error)
      }
      let user={}
      user.name=response.name
      user.email=response.email
      user.facebookId=response.id
      user.findOne({
        facebookId: user.facebookId
      }, (err, usr) => {
         if (usr) {
           usr.FacebookAlreadyCreated=true
          let payload = {
            sub: usr.id,
            exp: moment().add(sails.config.CONSTANTS.EXPIRATION_DAYS_NUMBER, sails.config.CONSTANTS.TIME_UNITY).unix()
          }
          let token = jwt.encode(payload, sails.config.CONSTANTS.JWT_SECRET)
          // eslint-disable-next-line standard/no-callback-literal
          callback(null,{
            user: usr,
            token: token
          })
        } else {
          user.fromFacebook = true
          User.create(user).exec((err, user) => {
            if (err) return callback(err)
              console.log(user)
            let payload = {
              sub: user.id,
              exp: moment().add(sails.config.CONSTANTS.EXPIRATION_DAYS_NUMBER, sails.config.CONSTANTS.TIME_UNITY).unix()
            }
            let token = jwt.encode(payload, sails.config.CONSTANTS.JWT_SECRET)
            // eslint-disable-next-line standard/no-callback-literal
            callback(null,{
              user: user,
              token: token
            })
          })
        }
      })
    })
  },
   /**
 * register a new customer
 * @param {string} customer-  customer's credentials
 */
signUpCustomer (customer, callback) {
    Customer.findOne({
      email: customer.email
    }, (err, usr) => {
      if (err) return callback(err)
      if (usr) return callback(new Error('email already in use'))
      Customer.create(customer).exec((err, User) => {
        if (err) return callback(err)
        let payload = {
          sub: User.id,
          exp: moment().add(sails.config.CONSTANTS.EXPIRATION_DAYS_NUMBER, sails.config.CONSTANTS.TIME_UNITY).unix()
        }
        let token = jwt.encode(payload, sails.config.CONSTANTS.JWT_SECRET)
        callback(null, {
          user: User.toJSON(),
          token: token
        })
      })
    })
  },
    /**
 * register a new  business
 * @param {string} business-  business's credentials
 */
signUpBusiness (business, callback) {
    Business.findOne({
      email: business.email
    }, (err, user) => {
      if (err) return callback(err)
      if (user) return callback(new Error('email already in use '))
      Business.create(business).exec((err, User) => {
        if (err) return callback(err)
        let payload = {
          sub: User.id,
          exp: moment().add(sails.config.CONSTANTS.EXPIRATION_DAYS_NUMBER, sails.config.CONSTANTS.TIME_UNITY).unix()
        }
        let token = jwt.encode(payload, sails.config.CONSTANTS.JWT_SECRET)
        callback(null, {
          user: User.toJSON(),
          token: token
        })
      })
    })
  },
  /**
 * login  an  existing customer
 * @param {string} customer- customer's credentials
 */
  logInCustomer (customer, callback) {
    Customer.findOne({
      email: customer.email
    }, (err, usr) => {
      if (err) return callback(err)
      else if (!usr) return callback(new Error('no such user'))

      else if (bcrypt.compareSync(customer.password, usr.password)) {
        let payload = {
          sub: usr.id,
          exp: moment().add(sails.config.CONSTANTS.EXPIRATION_DAYS_NUMBER, sails.config.CONSTANTS.TIME_UNITY).unix()
        }
        let token = jwt.encode(payload, sails.config.CONSTANTS.JWT_SECRET)
        callback(null, {
          user: usr.toJSON(),
          token: token
        })
      } else {
        callback(new Error('wrong password'))
      }
    })
  }
}
