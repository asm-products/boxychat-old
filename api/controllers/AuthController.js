/**
 * AuthController it has the endpoints to manage the Auth process
 *
 * @namespace Controllers
 * @class AuthController
 * @module BoxyChat
 */
var passport = require('passport');
module.exports = {

    /**
     * Description
     * @method index
     * @param {} req
     * @param {} res
     * @return
     */
    index: function (req, res) {
        if (req.wantsJSON)
            res.json({'hello': 'test'});
        else
            res.view({
                layout: false
            });
    },

    /**
     * POST `/login` endpoint
     * @method login
     * @param {Object} req Request Object
     * @param {Object} res Response Object
     * @return {Object} Response Oject
     */
    login: function (req, res) {
        passport.authenticate('local',
            function (err, user, info) {
                if ((err) || (!user)) console.log(err);
                req.logIn(user, function (err) {
                    if (err) res.send(err);
                    return res.redirect('/space/'); //res.send({ message: 'login successful' });
                });
            })(req, res);
    },

    /**
     * Description
     * @method logout
     * @param {} req
     * @param {} res
     * @return
     */
    logout: function (req, res) {
        req.logout();
        res.redirect('/');
    }
};