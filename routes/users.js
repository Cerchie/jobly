const express = require("express");
const router = new express.Router();
const { validate } = require('jsonschema');
const companySchema = require("../schemas/companies.json");
const partialUpdate = require("../helpers/partialUpdate")
const Company = require("../models/company");
const ExpressError = require("../helpers/expressError")
const patchCompanySchema = require("../schemas/patchCompanies.json")
const User = require("../models/user")
const patchUserSchema = require("../schemas/patchUsers.json")
const userSchema = require("../schemas/users.json")
const {authRequired, adminRequired, ensureCorrectUser} = require("../middleware/auth");
const {SECRET_KEY} = require("../config");
const jwt = require("jsonwebtoken");
router.get("/", async function(req, res, next) {
    try {
    
      const users = await User.findAll(req.query);
      return res.json({users});
    }
  
    catch (err) {
      return next(err);
     
    }
  });

/** POST /   userData => {user: newUser}  */

router.post("/", async function (req, res, next) {
    try {
        // Validate req.body against our user schema:
    const result = validate(req.body, userSchema);
  
    // If it's not valid...
    if (!result.valid) {
      //Collect all the errors in an array
      const listOfErrors = result.errors.map(e => e.stack);
      const err = new ExpressError(listOfErrors, 400);
      //Call next with error
      return next(err);
    }
      const user = await User.create(req.body);
      username = user.username;
      let token = jwt.sign({username}, SECRET_KEY);
      return res.status(201).json({ user, token });
    } catch (err) {
      return next(err);
    }
  });

  /** GET/ userData => user: userByUsername} */
router.get("/:username", async function (req,res,next){
    try {
        const username = req.params.username;
        const user = await User.findOne(username);
        
        return res.json({user})

    } catch(err){
        return next(err);
    }
});


  /** PATCH/ userData => {user: patcheduser} */
  router.patch("/:username", ensureCorrectUser, async function (req,res,next){
    try {
  // Validate req.body against our user schema:
  const result = validate(req.body, patchUserSchema);
  
  // If it's not valid...
  if (!result.valid) {
    //Collect all the errors in an array
    const listOfErrors = result.errors.map(e => e.stack);
    const err = new ExpressError(listOfErrors, 400);
    //Call next with error
    return next(err);
  }
    const user = await User.update(req.params.username, req.body);
    return res.status(201).json({ user });

    } catch(err){
        return next(err);
    }
})

router.delete("/:id", ensureCorrectUser, async function (req,res,next){
    try{    await User.remove(req.params.id);
        return res.json({ message: "user deleted" }); } 
        catch(err){
        return next(err);
    }
});

  module.exports = router;