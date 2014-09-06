var nodemailer = require('nodemailer');
module.exports = {

    /**
     * Sends an email to a given recipient
     * @method send
     * @param {object}   email           an object containing all of the necessary data to email
     * @param {Function} cb[err, res]    the callback to call once email is sent, or if it fails
     * @return
     */
    send: function (email, cb) {

        /** sets up the modemailer smtp transport */
        var transport = nodemailer.createTransport("SMTP", {
            service: "Mailgun",
            auth: {
                user: sails.config.nodemailer.user,
                pass: sails.config.nodemailer.pass
            }
        });

        /** sets up the mail options, from and such like that **/
        var from = email.from || 'nobody@nobody.com';
        var subject;
        if (sails.config.nodemailer.prependSubject) {
            subject = sails.config.nodemailer.prependSubject + email.subject;
        } else {
            subject = email.subject;
        }

        var mailOptions = {
            from: email.name + '<' + from + '>',
            to: email.to,
            subject: subject,
            html: email.messageHtml
        };

        /** Actually sends the email */
        transport.sendMail(mailOptions, function (err, response) {
            if (err) return cb(err);
            return cb(null, response);
        });
    }
};
