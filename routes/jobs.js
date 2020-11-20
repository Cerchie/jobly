const express = require("express");
const router = new express.Router();
const { validate } = require('jsonschema');

const jobSchema = require("../schemas/jobs.json")

const Job = require("../models/job");
const ExpressError = require("../helpers/expressError")

const patchJobSchema = require("../schemas/patchJobs.json")
const {ensureLoggedIn, authRequired, adminRequired} = require("../middleware/auth");
const { debug } = require("console");


router.get("/", authRequired, async function(req, res, next) {
    try {
    
      const jobs = await Job.findAll(req.query); debugger
      return res.json({jobs});
    }
  
    catch (err) {
      return next(err);
     
    }
  });

/** POST /   jobData => {job: newJob}  */

router.post('/', adminRequired, async function(req, res, next) {
  try {
    const validation = validate(req.body, jobNewSchema);

    if (!validation.valid) {
      throw new ExpressError(validation.errors.map(e => e.stack), 400);
    }

    const job = await Job.create(req.body);
    return res.status(201).json({ job });
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
  // Validate req.body against our job schema:
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