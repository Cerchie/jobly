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
      return res.status(201).json({ user });
    } catch (err) {
      return next(err);
    }
  });

  /** GET/ companyData => {company: companyByHandle} */
router.get("/:handle", async function (req,res,next){
    try {
        const handle = req.params.handle;
        const company = await Company.findOne(handle);
        
        return res.json({company})

    } catch(err){
        return next(err);
    }
});


  /** PATCH/ companyData => {company: patchedCompany} */
  router.patch("/:handle", async function (req,res,next){
    try {
  // Validate req.body against our company schema:
  const result = validate(req.body, patchCompanySchema);
  
  // If it's not valid...
  if (!result.valid) {
    //Collect all the errors in an array
    const listOfErrors = result.errors.map(e => e.stack);
    const err = new ExpressError(listOfErrors, 400);
    //Call next with error
    return next(err);
  }
    const company = await Company.update(req.params.handle, req.body);
    return res.status(201).json({ company });

    } catch(err){
        return next(err);
    }
})

router.delete("/:id", async function (req,res,next){
    try{    await User.remove(req.params.id);
        return res.json({ message: "user deleted" }); } 
        catch(err){
        return next(err);
    }
});

  module.exports = router;