var passport      = require('passport'),
    LocalStrategy = require('passport-local').Strategy;

module.exports = {

 express: {
    /**
     * Description
     * @method customMiddleware
     * @param {} app
     * @return 
     */
    customMiddleware: function(app){
      console.log('express midleware for passport');
      app.use(passport.initialize());
      app.use(passport.session());
    }
  }
  
};