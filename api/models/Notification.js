/**
 * Notification.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/#!documentation/models
 */

module.exports = {

    attributes: {
        type: {
            type: 'string',
            index: true
        },
        owner: {
            model:'User'
        },
        text: {
            type: 'string'
        },
        reference: {
            type: 'string'
        },
        name: {
            type: 'string'
        },
        status: {
            type: 'string'
        }
    },
    afterCreate: function(notification, cb) {
        SessionUser.findOne(notification.owner).exec(function (err, sessionUser) {
            if (sessionUser)
                sessionUser.sockets.forEach(function (socket) {
                    sails.sockets.emit(socket, 'notification', {id: notification.id, name: notification.name, type: notification.type, text: notification.text, reference: notification.reference, status: notification.status});
                });
        });
        cb();
    }
};
