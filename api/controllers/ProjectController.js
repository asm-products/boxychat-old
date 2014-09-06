/**
 * ProjectController
 *
 * @description :: Server-side logic for managing Projects
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {
    create: function (req, res, next) {
        var params = req.params.all();

        Project.create({name: params.company}, function (err, company) {

        });
    },

    remove: function (req, res, next) {

    },

    update: function (req, res, next) {

    },
    ownProjects: function(req, res, next) {
        Project.find({people: req.session.user.id}).exec(function (err, projects) {
            var returnProjects = [];
            if(projects) {
                projects.forEach(function(el) {
                    Project.subscribe(req.socket, el.id, ['update']);
                    returnProjects.push({id: el.id, name: el.name, slug: el.slug});
                });
            }
            res.json(returnProjects);
        });
    },
    /**
     * Description
     * @method join
     * @param {} req
     * @param {} res
     * @param {} next
     * @return
     */
    join: function (req, res, next) {
        var roomId = req.params.roomId;
        Group.findOne(roomId).exec(function findOneCB(err, found) {
            if (found) {
                found.users.forEach(function (element) {
                    if (element == req.session.user.id) {
                        return Group.subscribe(req, roomId, ['message']);
                    }
                });
            }
        });
    }
};

