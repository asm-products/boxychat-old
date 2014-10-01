/**
 * Requestontroller
 *
 * @description :: Server-side logic for managing Projects
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {
    invite: function(req, res, next) {
        var params = req.params.all();
        RequestManager.invite(params.email, req.session.user, function (err, data) {
            res.send({type: data.type, text: data.text, name: data.name, reference: data.reference});
        });
    }
};