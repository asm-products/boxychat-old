/**
 * Routes
 *
 * Your routes map URLs to views and controllers.
 *
 * If Sails receives a URL that doesn't match any of the routes below,
 * it will check for matching files (images, scripts, stylesheets, etc.)
 * in your assets directory.  e.g. `http://localhost:1337/images/foo.jpg`
 * might match an image file: `/assets/images/foo.jpg`
 *
 * Finally, if those don't match either, the default 404 handler is triggered.
 * See `config/404.js` to adjust your app's 404 logic.
 *
 * Note: Sails doesn't ACTUALLY serve stuff from `assets`-- the default Gruntfile in Sails copies
 * flat files from `assets` to `.tmp/public`.  This allows you to do things like compile LESS or
 * CoffeeScript for the front-end.
 *
 * For more information on routes, check out:
 * http://sailsjs.org/#documentation
 */

module.exports.routes = {


  // Make the view located at `views/homepage.ejs` (or `views/homepage.jade`, etc. depending on your
  // default view engine) your home page.
  //
  // (Alternatively, remove this and add an `index.html` file in your `assets` directory)
  '/': {
    controller: 'user',
    action: 'index'
  },
//  '/out':{
//    controller: 'home',
//    action: 'out'
//  },
//  '/reset':{
//    controller: 'home',
//    action: 'reset'
//  },
  '/success':{
    controller: 'home',
    action: 'success'
  },
  '/space': {
    controller: 'user',
    action: 'index'
  },
    '/space/*': {
        controller: 'user',
        action: 'index'
    },
  '/login': {
    controller: 'auth',
    action: 'index'
  },
  '/user/profile': {
    controller: 'user',
    action: 'profile'
  },
  'post /company/exists': {
    controller: 'CompanyController',
    action: 'companyExists'
  },
  'post /login': {
    controller: 'AuthController',
    action: 'login',
  },
  'get /logout': {
    controller: 'AuthController',
    action: 'logout'
  },
  /** Create the route to handle user activations */
  'get /user/:id/activate/:token': {
    controller: 'UserController',
    action: 'activate'
  },
  'post /user/resetpass': {
    controller: 'UserController',
    action: 'resetpass'
  },
  'post /user/updatePass/:id': {
    controller: 'UserController',
    action: 'updatePass'
  },
  'post /user/update/:id': {
    controller: 'UserController',
    action: 'update'
  },
//  'get /soc': {
//    controller: 'HomeController',
//    action: 'soc'
//  },
  '/group/:roomId/join': {
    controller: 'GroupController',
    action: 'join'
  },
  'post /chat/room/:roomId': {
    controller: 'ChatController',
    action: 'room'
  },
    'post /chat/private/:userId': {
        controller: 'ChatController',
        action: 'direct'
    },
  'get /chat/conversations': {
    controller: 'ChatController',
    action: 'getConversations'
  }, //'ChatController.room',
    'get /chat/contacts': {
        controller: 'ChatController',
        action: 'getContacts'
    },
    'get /chat/contacts/project/:projectId': {
        controller: 'ChatController',
        action: 'getContactsProject'
    },
    'get /projects/own': {
        controller: 'ProjectController',
        action: 'ownProjects'
    },
    'post /request/invite': {
        controller: 'RequestController',
        action: 'invite'
    }
  // Custom routes here...


  // If a request to a URL doesn't match any of the custom routes above, it is matched
  // against Sails route blueprints.  See `config/blueprints.js` for configuration options
  // and examples.

};