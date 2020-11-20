const express = require("express");
const router = new express.Router();
const { validate } = require('jsonschema');
const companySchema = require("../schemas/companies.json");
const partialUpdate = require("../helpers/partialUpdate")
const Company = require("../models/company");
const ExpressError = require("../helpers/expressError")
const patchCompanySchema = require("../schemas/patchCompanies.json")
const {ensureLoggedIn, authRequired, adminRequired} = require("../middleware/auth");
/** GET / => {companies: [company, ...]}  
 
SEARCH. If the query string parameter is passed, a filtered list of handles and names 
should be displayed based on the search term and if the name includes it.

MIN_EMPLOYEES. If the query string parameter is passed, titles and company handles 
should be displayed that have a number of employees greater than the value of the query string parameter.

MAX_EMPLOYEES. If the query string parameter is passed, a list of titles and company handles
 should be displayed that have a number of employees less than the value of the query string parameter.

If the min_employees parameter is greater than the max_employees parameter, 
respond with a 400 status and a message notifying that the parameters are incorrect.
*/

/** GET /  =>  {companies: [company, company]}  */

router.get('/', authRequired, async function(req, res, next) {
  try {
    const companies = await Company.findAll(req.query);
    return res.json({ companies });
  } catch (err) {
    return next(err);
  }
});

/** POST /   companyData => {company: newCompany}  */

router.post("/", adminRequired, async function (req, res, next) {
    try {
        // Validate req.body against our company schema:
    const result = validate(req.body, companySchema);
  
    // If it's not valid...
    if (!result.valid) {
      //Collect all the errors in an array
      throw new ExpressError(result.errors.map(e => e.stack), 400);
 
    }
      const company = await Company.create(req.body);
      return res.status(201).json({ company });
    } catch (err) {
      return next(err);
    }
  });

  /** GET/ companyData => {company: companyByHandle} */
router.get("/:handle", authRequired, async function (req,res,next){
    try {
        const handle = req.params.handle;
        const company = await Company.findOne(handle);
        
        return res.json({company})

    } catch(err){
        return next(err);
    }
});


  /** PATCH/ companyData => {company: patchedCompany */
  router.patch("/:handle", adminRequired, async function (req,res,next){
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

router.delete("/:handle", adminRequired, async function (req,res,next){
    try{    await Company.remove(req.params.handle);
        return res.json({ message: "company deleted" }); } catch(err){
        return next(err);
    }
});

  module.exports = router;