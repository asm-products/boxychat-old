/**
 * GroupController
 *
 * @description :: Server-side logic for managing Groups
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {
	/**
	 * Description
	 * @method join
	 * @param {} req
	 * @param {} res
	 * @param {} next
	 * @return 
	 */
	join: function(req, res, next) {
		var roomId = req.params.roomId;
		Group.findOne(roomId).exec(function findOneCB(err,found){
			if(found){
				found.users.forEach(function (element) {
					if(element == req.session.user.id) {
						return Group.subscribe(req, roomId, ['message']);
					}
				});
			}
		});
	}
};

