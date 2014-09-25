
module.exports = {

    invite: function(email, sessionUser, mainCb) {
        var self = this;
        User.findOne({email: email}).exec( function (err, user) {
            if(user) {
                self.createRequest(sessionUser, user, 'invite', mainCb, self.inviteUser);
            }
            else {
                self.createRequest(sessionUser, email, 'invite', mainCb, self.inviteNewUser);
            }
        });
    },

    createRequest: function(sessionUser, user, type, mainCb, cb) {
        var request = {
            type: type,
            owner: sessionUser.id,
            status: 'new'
        };

        if(user.id)
            request.to = user.id;
        else
            request.email = user;

        Request.create(request).exec(function (err, request) {
            cb(err, request, user, sessionUser, mainCb);
        });
    },

    inviteNewUser: function(err, request, user, sessionUser, mainCb) {
        if (request && request.id) {
            mainCb();
        }
    },

    inviteUser: function(err, request, user, sessionUser, mainCb) {
        if(request && request.id) {
            var text = 'wants to talk to you.';
            NotificationManager.create(request.type, request.to, sessionUser.name, text, request.id, function(err, notification) {
                if(notification && notification.id) {
                    notification.name = user.name;
                    console.log(notification);
                    mainCb(err, notification);
                    RequestManager.sendEmail(user, sessionUser);
                }
            });
        }
    },

    sendEmail: function(user, sessionUser){
        if(sessionUser.notifications && sessionUser.notifications.invite) {
            sails.renderView('email/inviteUser', {layout: false, user: user, other: sessionUser},
                function (err, list) {
                    mailer.send({
                        name: user.name,
                        from: sails.config.nodemailer.from,
                        to: user.email,
                        subject: 'BoxyChat - ' + sessionUser.name + ' wants to talk to you',
                        messageHtml: list
                    }, function (err, response) {
                        sails.log.debug('mailer sent', err, response);
                    });

                });
        }
    }

};