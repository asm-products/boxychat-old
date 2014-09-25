var fs = require('fs')
    , gm = require('gm');

// resize and remove EXIF profile data

module.exports = {

    index: function (req,res){

        res.writeHead(200, {'content-type': 'text/html'});
        res.end(
            '<form action="/upload/avatar" enctype="multipart/form-data" method="post">'+
            '<input type="text" name="title"><br>'+
            '<input type="file" name="avatar" multiple="multiple"><br>'+
            '<input type="submit" value="Upload">'+
            '</form>'
        );
    },
    uploadAvatar: function  (req, res) {
        console.log(req);
        var userId = req.session.user.id;
        var avatarFile = __dirname + '/../../avatars/user/' + userId + '.jpg';
        req.file('avatar').upload({saveAs: avatarFile}, function (err, files) {
            if (err) {
                console.log(err)

                return res.serverError(err);
            }
            gm(avatarFile)
                .resize('200', '200', '^')
                .gravity('Center')
                .crop('200', '200')
                .write(avatarFile, function (err) {
                    console.log(err)
                    if (!err) {
                        console.log('done');
                        User.publishUpdate(req.session.user.id,{ type:"userAvatar", id:req.session.user.id });
                        return res.json({
                            message: files.length + ' file(s) uploaded successfully!',
                            files: files
                        });

                    }

                });

        });
    }

};