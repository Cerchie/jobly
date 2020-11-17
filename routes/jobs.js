const express = require("express");
const router = new express.Router();
const { validate } = require('jsonschema');
const companySchema = require("../schemas/companies.json");
const jobSchema = require("../schemas/jobs.json")
const partialUpdate = require("../helpers/partialUpdate")
const Company = require("../models/company");
const Job = require("../models/job");
const ExpressError = require("../helpers/expressError")
const patchCompanySchema = require("../schemas/patchCompanies.json")
const patchJobSchema = require("../schemas/patchJobs.json")
/**
 * This route should list all the titles and company handles for all jobs, ordered by the most recently posted jobs. It should also allow for the following query string parameters

search: If the query string parameter is passed, a filtered list of titles
 and company handles should be displayed based on the search term and if the job title includes it.


min_salary: If the query string parameter is passed, titles and company handles 
should be displayed that have a salary greater than the value of the query string parameter.


min_equity: If the query string parameter is passed, a list of titles and 
company handles should be displayed that have an equity greater than the value of the query string parameter.
It should return JSON of {jobs: [job, ...]}
*/

router.get("/", async function(req, res, next) {
    try {
    
      const jobs = await Job.findAll(req.query);
      return res.json({jobs});
    }
  
    catch (err) {
      return next(err);
     
    }
  });

/** POST /   jobData => {job: newJob}  */

router.post("/", async function (req, res, next) {
    try {
        // Validate req.body against our company schema:
    const result = validate(req.body, companySchema);
  
    // If it's not valid...
    if (!result.valid) {
      //Collect all the errors in an array
      const listOfErrors = result.errors.map(e => e.stack);
      const err = new ExpressError(listOfErrors, 400);
      //Call next with error
      return next(err);
    }
      const company = await Company.create(req.body);
      return res.status(201).json({ company });
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


  /** PATCH/ companyData => {company: patchedCompany */
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

router.delete("/:handle", async function (req,res,next){
    try{    await Company.remove(req.params.handle);
        return res.json({ message: "company deleted" }); } catch(err){
        return next(err);
    }
})

  module.exports = router;