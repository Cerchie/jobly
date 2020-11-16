const express = require("express");
const router = new express.Router();

const { validate } = require("jsonschema");


const jsonschema = require("jsonschema");
const companySchema = require("../schemas/companies.json");

const Company = require("../models/company");


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

router.get("/", async function(req, res, next) {
    try {
      const companies = await Company.findAll(req.query);
      return res.json({companies});
    }
  
    catch (err) {
      return next(err);
     
    }
  });

  module.exports = router;