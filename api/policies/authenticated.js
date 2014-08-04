/**
 * Allow any authenticated user.
 * @method exports
 * @param {} req
 * @param {} res
 * @param {} next
 * @return 
 */
module.exports = function(req, res, next){
  if (req.isAuthenticated()){
    return next();
  }else{
    return res.redirect('/login/');
  }
};
