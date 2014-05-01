/**
 * UserController.js
 *
 * @description ::
 * @docs        :: http://sailsjs.org/#!documentation/controllers
 */
var Puid = require('puid');

module.exports = {
  /*
  index: function(req, res){
    console.log(req.user);
    User.findOne(req.user.id).populate('files').exec(function( err, fileuser){

      console.log(err);
      console.log(fileuser);
      res.view({
        user : fileuser
      });

    });

  },
  */
  index: function(req, res){
      res.view({
        user : req.user,
        layout: false
      });
  },

  profile: function(req, res){
      res.view({
        user : req.user
      }, false);
  },

  update: function(req, res, next){

    var params = req.params.all();

      User.findOne(req.user, function(err, user){



          console.log('firstname: ' + user.firstName + ', ' + 'lastname: ' + user.lastName + ', ' + 'pass: ' + user.password);
          console.log('-----------');
          console.log('email: ' + params.email + ', firstname: ' + params.firstName + ', ' + 'lastname: ' + params.lastName + ', ' + 'pass: ' + params.password);


          User.update(user.id, params).exec(function updateCB(err, updated){
            console.log(err)
            console.log('Updated user to have pass');
            res.redirect('/user/profile');
          });

      });

  },

  updatePass: function(req,res,next){

    var params = req.params.all();

    crypto.generate({saltComplexity: 10}, params.password, function(err, hash){
      if (err) console.log(err);

      params.password = hash;
      newPass = params.password;
      console.log('hashed pass: '+ params.password);
      // console.log(hash);

      User.findOne(req.user, function(err, user){

          User.update({password: user.password}, {password: params.password}).exec(function updateCB(err, updated){
            console.log('Updated user to have pass');
            res.redirect('/user/profile');
          });

      });

    });

  },
    /*
    puid = new Puid(true);

    var params = req.params.all(),
        user = req.user;

    User.findOne(user, function( err, user ){
      console.log(user.firstName);
      console.log(user.password);

      crypto.generate({saltComplexity: 10}, params.password, function(err, hash){
        if (err) console.log(err);

        console.log(user.firstName + ' ' + user.lastName + ' ' + params.firstName + ' ' + params.lastName);
        console.log(user.email + ' ' + params.email);
        console.log('original user pass '+ user.password);

        params.password = hash;

        var newPass = hash;

        console.log('hashed pass: '+ params.password);
        // console.log(hash);
        });

        User.update(
          {firstName: user.firstName},
          {firstName: params.firstName},
          {lastName: user.lastName},
          {lastName: params.lastName},
          {password: user.password},
          {password: params.password}
        ).exec(function updateCB(err,updated){
          console.log('Updated user to have pass ' + params.password);
        });

        res.redirect('/user/profile');
    });
  },
  */
  admin: function(req, res){

    User.find( function foundFiles(err, users) {
      if (err) return next(err);
      // pass the array down to the /views/index.ejs page
      res.view({
        users: users
      });
    });
  },

  create: function(req, res){
    var params = req.params.all();
    User.create(params, function(err, user){
      if (err){ res.send(500, err); }else{
        if(sails.config.user.requireUserActivation){
          var emailTemplate = res.render('email/email.ejs', {user: user}, function(err, list){

            nodemailer.send({
              name:       user.firstName + ' ' + user.lastName,
              from:       sails.config.nodemailer.from,
              to:         user.email,
              subject:       'New Account Acivation Required',
              messageHtml: list
            }, function(err, response){
              sails.log.debug('nodemailer sent', err, response);
            });
            res.redirect('/success');

          });
        }else{
          res.redirect('/success');
        }
      }
    });
  },

/**
 * Activates a given user based on the
 * ID and activationToken provided
 */
  activate: function(req, res){
    var params = req.params.all();

    sails.log.debug('activation action');

    //Activate the user that was requested.
    User.update({
      id: params.id,
      activationToken: params.token
    },{
      activated: true
    }, function(err, user) {
      // Error handling
      if (err) {
        sails.log.debug(err);
        res.send(500, err);
      // Updated users successfully!
      } else {
        sails.log.debug("User activated:", user);
        res.redirect('/');
      }
    });

  },
  resetpass: function(req, res){
    puid = new Puid(true);

    var email = req.param('email'),
        newPass = puid.generate();

    User.findOneByEmail(email, function( err, user ){

      crypto.generate({saltComplexity: 10}, newPass, function(err, hash){
        if(err){
          return cb(err);
        }else{
          var emailTemplate = res.render('email/reset.ejs', function(err){

          nodemailer.send({
            name:       user.firstName + ' ' + user.lastName,
            from:       sails.config.nodemailer.from,
            to:         email,
            subject:    'Peices pass Reset',
            messageHtml: 'Your new password for peices.co ' + newPass
          }, function(err, response){
            sails.log.debug('nodemailer sent', err, response);
          });
          res.redirect('/login');

        });
        console.log(user.firstName + user.lastName);
        console.log(user.email);
        console.log('original user pass '+ user.password);
          newPass = hash;
        console.log('hashed pass: '+ newPass);
        // console.log(hash);
          User.update(
            {password: user.password}, {password: newPass}
          ).exec(function updateCB(err,updated){
            console.log('Updated user to have pass ' + newPass);
          });
          }
        });
      });
    }


};
