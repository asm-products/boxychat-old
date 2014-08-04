/**
 * sessionAuth
 *                 Assumes that your login action in one of your controllers sets `req.session.authenticated = true;`
 * @module :: Policy
 * @description :: Simple policy to allow any authenticated user
 * @docs :: http://sailsjs.org/#!documentation/policies
 * @method exports
 * @param {} req
 * @param {} res
 * @param {} next
 * @return CallExpression
 */
module.exports = function(req, res, next) {

  // User is allowed, proceed to the next policy, 
  // or if this is the last policy, the controller
  if (req.session.authenticated) {
    return next();
  }

  // User is not allowed
  // (default res.forbidden() behavior can be overridden in `config/403.js`)
  return res.forbidden('You are not permitted to perform this action.');
};
