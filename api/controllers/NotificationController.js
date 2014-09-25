/**
 * Requestontroller
 *
 * @description :: Server-side logic for managing Projects
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {
    accept: function(req, res, nect) {
        var params = req.params.all();
        NotificationManager.accept(params.id, req.session.user, function (err, data) {
            res.send({type: data.type, text: data.text, name: data.name, reference: data.reference});
        });
    }
};

