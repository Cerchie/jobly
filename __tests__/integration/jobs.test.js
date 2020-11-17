/** Integration tests for companies routes */

process.env.NODE_ENV = "test"

const request = require("supertest");


const app = require("../../app");
const db = require("../../db");


// handle of sample company
let company_handle;


beforeEach(async () => {
  let result = await db.query(`
  INSERT INTO jobs (id, title, salary, equity, company_handle, date_posted)
  VALUES (    
    991,
    'Pear Pusher',
      34000,
      .4,
      'Pear',
      '2020-09-09'
  ) RETURNING id`);

  job_id = result.rows[0].id
});
///testing get route
describe("GET /jobs", function () {
    test("Gets a list of 1 job", async function () {
      const response = await request(app).get(`/jobs`);
      const jobs = response.body.jobs;
      expect(jobs).toHaveLength(1);
      expect(jobs[0]).toHaveProperty("id");
    });
  });


afterEach(async function () {
  await db.query("DELETE FROM COMPANIES");
});


afterAll(async function () {
  await db.end()
});