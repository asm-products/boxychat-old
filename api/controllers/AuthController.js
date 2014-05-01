/**
 * AuthController.js
 *
 * @description ::
 * @docs        :: http://sailsjs.org/#!documentation/controllers
 */
var passport = require('passport');
module.exports = {

  index: function(req, res){
    if(req.wantsJSON)
      res.json({'hello': 'test'});
    else
    res.view({
      layout: 'external-layout'
    });
  },

  login: function(req, res){
    passport.authenticate('local',
    function(err, user, info){
      if ((err) || (!user)) console.log(err);

      req.logIn(user, function(err){
        if (err) res.send(err);
        return res.redirect('/user/'); //res.send({ message: 'login successful' });
      });
    })(req, res);
  },

  /*
  login: function(req, res){
    passport.authenticate('local', function(err, user, info) {
      if (err) {
        console.log(err);
        return res.redirect('/login'); // will generate a 500 error
      }
    // Generate a JSON response reflecting authentication status
      if (! user) {
        return res.redirect('/login');
      }
      return res.redirect('/user/');
    })(req, res);
  },
  */
  logout: function (req,res){
    req.logout();
    res.redirect('/out');
  }
}
