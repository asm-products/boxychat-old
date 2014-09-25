

module.exports = {

    create: function(type, userId, name, text, reference, cb) {
        var notification = {
            type: type,
            owner: userId,
            text: text,
            name: name,
            status: 'new'
        };
        if(reference) {
            notification.reference = reference;
        }

        Notification.create(notification).exec(function(err, notification) {
            console.log(err)
            cb(err, notification);
        });
    },

    accept: function(id, user, cb) {
        Notification.findOne({owner: user.id, id: id, status: 'new'}).exec(function(err, notification) {
            console.log('notificationssss');
            console.log(notification);
            Request.findOne({id: notification.reference}).exec(function(err, request) {
                console.log(err)
                console.log(request);
                if(request.id) {
                    request.status = 'accepted';
                    request.save();
                    User.findOne({id: request.to}).exec(function(err, user) {
                        User.findOne({id: request.owner}).exec(function(err, user2) {
                            user.contacts.push(user2.id);
                            user2.contacts.push(user.id);
                            user.save();
                            user2.save();

                            SessionUser.findOne(user.id).exec(function (err, sessionUser) {
                                if (sessionUser)
                                    sessionUser.sockets.forEach(function (socket) {
                                        sails.sockets.emit(socket, 'contact', {id: user2.id, name: user2.name, avatar: user2.avatar});
                                    });
                            });

                            SessionUser.findOne(user2.id).exec(function (err, sessionUser) {
                                if (sessionUser)
                                    sessionUser.sockets.forEach(function (socket) {
                                        sails.sockets.emit(socket, 'contact', {id: user.id, name: user.name, avatar: user.avatar});
                                    });
                            });
                        });
                    });
                }
            });
        });
    }

};