/** Integration tests for companies routes */

process.env.NODE_ENV = "test"

const request = require("supertest");


const app = require("../../app");
const db = require("../../db");


// id of sample job
let job_id;


beforeEach(async () => {
  let company = await db.query(`
    INSERT INTO 
      companies (handle, name, num_employees, description, logo_url)   
      VALUES (
        'Splash', 
        'Splash Zone', 
         100, 
        'Inflatable pool company', 
        'https://media.keyshot.com/uploads/2018/10/keyshot-icon-256.png')
      RETURNING handle`);

  let result = await db.query(`
  INSERT INTO 
  jobs (id, title, salary, equity, company_handle, date_posted)
  VALUES (    
    991,
    'Pear Pusher',
    34000,
    0.4,
    ${company.rows[0].handle},
    '2020-09-09'
  )`);

  job_id = result.rows[0].id
});
///testing get route
describe("GET /jobs", function () {
    test("Gets a list of jobs", async function () {
      const response = await request(app).get(`/jobs`);
      const jobs = response.body.jobs;
      expect(jobs[0]).toHaveProperty("id");
    });
  });

////testing post route

describe("POST /jobs",function () {
  test("Creates a new job", async function () {
    const response = await request(app)
        .post(`/jobs`)
        .send({
          id: 4444,
          title: "title4",
          salary: 888,
          equity: 0.09,
          company_handle: "Pear",
          date_posted: "2020-03-03"
        });
        
    expect(response.statusCode).toBe(201);
    expect(response.body.job).toHaveProperty("id");
  
  }); });


  //testing get by id route
  describe("GET /jobs/:id",  function () {
    test("Gets a single job by its id", async function () {
      const response = await request(app)
          .get(`/jobs/${job_handle}`)
      expect(response.body.job).toHaveProperty("id");
      expect(response.body.job.id).toBe(job_id);
    });
  
    test("Responds with 404 if can't find job in question", async function () {
      const response = await request(app)
          .get(`/jobs/'palantir'`)
      expect(response.statusCode).toBe(404);
    });
  });

///testing patch route 
  describe("PATCH /jobs/:handle", function () {
    test("Updates a single job", async function () {
      const response = await request(app)
          .put(`/jobs/${job_id}`)
          .send({
            id: 991,
            title: "Pear Corp",
            salary: 52,
            equity: .2,
            company_handle: 'Splash',
            date_posted: "2020-02-02"
          });
      expect(response.body.job).toHaveProperty("id");
      expect(response.body.job.title).toBe("Pear Corp");
    });
  
    test("Prevents a bad job update", async function () {
      const response = await request(app)
          .put(`/companies/${job_id}`)
          .send({
            id: 991,
            badField: "do not add me",
            title: "Pear Corp",
            salary: 52,
            equity: .2,
            company_handle: 'Splash',
            date_posted: "2020-02-02"
          });
      expect(response.statusCode).toBe(404);
    });

  ///testing delete route
  describe("DELETE /jobs/:id", function () {
    test("Deletes a single job by handle", async function () {
      const response = await request(app)
          .delete(`/companies/${job_id}`)
      expect(response.body).toEqual({message: "job deleted"});
    });
  });


afterEach(async function () {
  await db.query("DELETE FROM COMPANIES");
});


afterAll(async function () {
  await db.end()
}); });