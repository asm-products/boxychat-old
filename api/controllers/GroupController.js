/**
 * GroupController
 *
 * @description :: Server-side logic for managing Groups
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {

    create: function(req, res, next) {
        var params = req.params.all();
        var name = params.name;
        var group = {
            name: name,
            type: 'private',
            owner: req.session.user.id,
            users: [{id: req.session.user.id, name: req.session.user.name}]
        };
        Group.create(group).exec(function(err, group) {
            res.json(group);
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
    },

    addUser: function(req, res, next) {
        var params = req.params.all();
        var groupId = params.groupId;
        var userId = params.userId;
        console.log(groupId)
        Group.findOne(groupId). exec(function(err, group) {
            if(group) {
                User.findOne(userId).exec(function(err, user) {
                    console.log(err)
                    console.log(user)
                    if(user) {
                        group.users.push({id: user.id, name: user.name});
                        Group.update(groupId, {users: group.users}).exec(function(err, found) {
                            if(err) {
                                res.send(err);
                            } else {
                                res.send({user: user.id});
                                NotificationManager.create('invite-group', user.id, user.name, 'You have been invited to the group: ' + group.name, null, function() {
                                    SessionUser.findOne(user.id).exec(function (err, sessionUser) {
                                        if (sessionUser)
                                            sessionUser.sockets.forEach(function (socket) {
                                                sails.sockets.emit(socket, 'notification', {type: 'invite-group', text: 'You have been invited to the group: ' + group.name});
                                            });
                                    });
                                }
                            );


                            }

                        });
                    }
                });
            }
        });
    }
};

