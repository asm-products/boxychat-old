var passport = require('passport'),
    LocalStrategy = require('passport-local').Strategy;

// helper functions
/**
 * Description
 * @method findById
 * @param {} id
 * @param {} fn
 * @return
 */
function findById(id, fn) {
    User.findOne(id).exec(function (err, user) {
        if (err) {
            return fn(null, null);
        } else {
            return fn(null, user);
        }
    });
}

/**
 * Description
 * @method findByEmail
 * @param {} u
 * @param {} fn
 * @return
 */
function findByEmail(u, fn) {
    var params = {email: u};
    if (sails.config.user.requireUserActivation)
        params.activated = true;

    User.findOne(params).exec(function (err, user) {
        // Error handling
        if (err) {
            return fn(null, null);
            // The User was found successfully!
        } else {
            return fn(null, user);
        }
    });
}

// Passport session setup.
// To support persistent login sessions, Passport needs to be able to
// serialize users into and deserialize users out of the session. Typically,
// this will be as simple as storing the user ID when serializing, and finding
// the user by ID when deserializing.
passport.serializeUser(function (user, done) {
    done(null, user.id);
});

passport.deserializeUser(function (id, done) {
    findById(id, function (err, user) {
        done(err, user);
    });
});


// Use the LocalStrategy within Passport.
// Strategies in passport require a `verify` function, which accept
// credentials (in this case, a username and password), and invoke a callback
// with a user object.
passport.use(new LocalStrategy(
    function (email, password, done) {
        // asynchronous verification, for effect...
        process.nextTick(function () {
            // Find the user by username. If there is no user with the given
            // username, or the password is not correct, set the user to `false` to
            // indicate failure and set a flash message. Otherwise, return the
            // authenticated `user`.
            findByEmail(email, function (err, user) {
                if (err) {
                    return done(null, err);
                }
                if (!user) {
                    return done(null, false, {message: 'Unknown user ' + email});
                }
                crypto.compare(password, user.password, function (error, response) {
                    if (error) return done(null, false, {message: error});
                    if (!response) return done(null, false, {message: 'Invalid Password'}); // error passwords dont compare
                    var returnUser = {email: user.email, createdAt: user.createdAt, id: user.id};
                    return done(null, returnUser, {message: 'Logged In Successfully'});
                });

            });
        });
    }
));
