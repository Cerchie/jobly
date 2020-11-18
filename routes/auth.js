
const ExpressError = require("../helpers/expressError");
const User = require("../models/user")
const jwt = require("jsonwebtoken");
const Router = require("express").Router;
const router = new Router();
const {SECRET_KEY} = require("../config");


/** POST /login - login: {username, password} => {token}
 *
 * Make sure to update their last-login!
 *
 **/

    router.post("/", async function (req, res, next) {
        try {
          let {username, password} = req.body;
          if (await User.authenticate(username, password)) {
            let token = jwt.sign({username}, SECRET_KEY);
            User.updateLoginTimestamp(username);
            return res.json({token});
          } else {
            throw new ExpressError("Invalid username/password", 400);
          }
        }
      
        catch (err) {
          return next(err);
        }
      });

      module.exports = router;