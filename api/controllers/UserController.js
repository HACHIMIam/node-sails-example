/**
 * UserController
 *
 * @description :: Server-side logic for managing users
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	/**
 * login or register  a customer with facebook
 * @param {string} facebookToken- facebook token
 */
facebook (req, res) {
    let facebookToken = req.body.token
    AuthService.facebookAuth(facebookToken ,(err, result) => {
      if (err) {
        return res.badRequest(err)
      }
      res.ok(result)
    
    })
  },
  /**
 * login  an  existing customer with email and password
 * @param {string} customer- customer's credentials
 */
  EmailLogIn (req, res) {
    const customer = req.body
    AuthService.logInCustomer(customer, (err, result) => {
      if (err) {
        return res.badRequest(err)
      }
      res.ok(result)
    })
  },
  /**
 * register a new customer  with email and password
 * @param {string} newCustomer- new customer's credentials
 */
  EmailSignUP (req, res) {
    const newCustomer = req.body
    AuthService.signUpCustomer(newCustomer, (err, result) => {
      if (err) {
        return res.badRequest(err)
      }
      res.ok(result)
    })
  }
};

