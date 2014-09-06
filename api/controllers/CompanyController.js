/**
 * CompanyController.js
 *
 * @description ::
 * @docs        :: http://sailsjs.org/#!documentation/controllers
 */

module.exports = {
    /**
     * Description
     * @method companyExists
     * @param {} req
     * @param {} res
     * @return
     */
    companyExists: function (req, res) {
        var params = req.params.all();
        Company.findOne(params).exec(function findOneCB(err, found) {
            var exists = false;
            if (err)
                console.log(err);
            if (found)
                exists = true;
            res.json({exists: exists});
        });
    },
};