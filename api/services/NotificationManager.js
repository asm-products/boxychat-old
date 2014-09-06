

module.exports = {

    create: function(type, userId, text, reference, cb) {
        var notification = {
            type: type,
            owner: userId,
            text: text
        };
        if(reference) {
            notification.reference = reference;
        }

        Notification.create(notification).exec(function(err, notification) {
            cb(err, notification);
        });
    }

};