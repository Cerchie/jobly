const express = require("express");
const router = new express.Router();
const { validate } = require('jsonschema');

const jobSchema = require("../schemas/jobs.json")

const Job = require("../models/job");
const ExpressError = require("../helpers/expressError")

const patchJobSchema = require("../schemas/patchJobs.json")
const {ensureLoggedIn, authRequired, adminRequired} = require("../middleware/auth");
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

router.get("/", authRequired, async function(req, res, next) {
    try {
    
      const jobs = await Job.findAll(req.query);
      return res.json({jobs});
    }
  
    catch (err) {
      return next(err);
     
    }
  });

/** POST /   jobData => {job: newJob}  */

router.post("/", adminRequired, async function (req, res, next) {
    try {
        // Validate req.body against our job schema:
    const result = validate(req.body, jobSchema);
  
    // If it's not valid...
    if (!result.valid) {
      //Collect all the errors in an array
      const listOfErrors = result.errors.map(e => e.stack);
      const err = new ExpressError(listOfErrors, 400);
      //Call next with error
      return next(err);
    }
      const job = await Job.create(req.body);
      return res.status(201).json({ job  });
    } catch (err) {
      return next(err);
    }
  });

  /** GET/ jobData => {job: jobByID} */
  router.get("/:id", authRequired, async function (req,res,next){
    try {
        const id = req.params.id;
        const job = await Job.findOne(id);
        return res.json({job})

    } catch(err){
        return next(err);
    }
});

  /** PATCH/ jobData => {job: patchedJob */
  router.patch("/:id", adminRequired, async function (req,res,next){
    try {
  // Validate req.body against our company schema:
  const result = validate(req.body, patchJobSchema);
  
  // If it's not valid...
  if (!result.valid) {
    //Collect all the errors in an array
    const listOfErrors = result.errors.map(e => e.stack);
    const err = new ExpressError(listOfErrors, 400);
    //Call next with error
    return next(err);
  }
    const job = await Job.update(req.params.id, req.body);
    return res.status(201).json({ job });

    } catch(err){
        return next(err);
    }
})
// DELETE / jobId => {"message":"job deleted"}
router.delete("/:id", adminRequired, async function (req,res,next){
    try {    await Job.remove(req.params.id);
        return res.json({ message: "job deleted" }); } catch(err){
        return next(err);
    }
})

  module.exports = router;