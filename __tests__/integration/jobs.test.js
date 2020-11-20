// npm packages
const request = require("supertest");

// app imports
const app = require("../../app");

const {
  TEST_DATA,
  afterEachHook,
  beforeEachHook,
  afterAllHook
} = require("./config");


beforeEach(async () => {
  await beforeEachHook(TEST_DATA);
});


describe("POST /jobs",function () {
  test("Creates a new job", async function () {
    const response = await request(app)
        .post(`/jobs`)
        .send({
          title: "SoftwareEngineerest",
          salary: 1000000,
          company_handle: TEST_DATA.currentCompany.handle,
          equity: 0.2,
          _token: TEST_DATA.userToken
        });
    expect(response.body).toHaveProperty("title");
    expect(response.statusCode).toBe(201);
    
  });


  test("Prevents creating a job without required title field", async function () {
    const response = await request(app)
        .post(`/jobs`)
        .send({
          _token: TEST_DATA.userToken,
          id: 7777777,
          salary: 1000000,
          equity: 0.2,
          company_handle: TEST_DATA.currentCompany.handle
        });
    expect(response.statusCode).toBe(400);
  });
});


describe("GET /jobs", function () {
  test("Gets a list of jobs", async function () {
    const response = await request(app)
    .get(`/jobs`)
    .set('authorization', `${TEST_DATA.userToken}`)
    .send({
      _token: TEST_DATA.userToken
    });
    const jobs = response.body;

    expect(jobs).toHaveProperty("jobs");

  });

  test("Has working search", async function () {
    await request(app)
        .post(`/jobs`)
        .send({
          title: "Software Engineer in Test",
          salary: 1000000,
          equity: 0.2,
          company_handle: TEST_DATA.currentCompany.handle,
          _token: TEST_DATA.userToken
        });

    await request(app)
        .post(`/jobs`)
        .send({
          title: "Web Dev",
          salary: 1000000,
          company_handle: TEST_DATA.currentCompany.handle,
          _token: TEST_DATA.userToken
        });

    const response = await request(app)
        .get("/jobs?search=web+dev")
        .send({_token: TEST_DATA.userToken});
    expect(response.body.jobs).toHaveLength(1);
    expect(response.body.jobs[0]).toHaveProperty("id");
    expect(response.body.jobs[0]).toHaveProperty("title");
  });
});


describe("GET /jobs/:id", function () {
  test("Gets a single job", async function () {
    const response = await request(app).get(`/jobs/${TEST_DATA.jobId}`).send({_token: TEST_DATA.userToken});
    expect(response.body.job).toHaveProperty("id");

    expect(response.body.job.id).toBe(TEST_DATA.jobId);
  });

  test("Responds with a 404 if it cannot find the job in question", async function () {
    const response = await request(app)
        .get(`/jobs/999`).send({_token: TEST_DATA.userToken})
    expect(response.statusCode).toBe(404);
  });
});


describe("PATCH /jobs/:id", function () {
  test("Updates a single a job's title", async function () {
    const response = await request(app)
        .patch(`/jobs/${TEST_DATA.jobId}`)
        .send({title: "xkcd", _token: TEST_DATA.userToken});
    expect(response.body.job).toHaveProperty("id");

    expect(response.body.job.title).toBe("xkcd");
    expect(response.body.job.id).not.toBe(null);
  });

  test("Updates a single a job's equity", async function () {
    const response = await request(app)
        .patch(`/jobs/${TEST_DATA.jobId}`)
        .send({
          _token: TEST_DATA.userToken, equity: 0.5
        });
    expect(response.body.job).toHaveProperty("id");
  });

  test("Prevents a bad job update", async function () {
    const response = await request(app)
        .patch(`/jobs/${TEST_DATA.jobId}`)
        .send({
          _token: TEST_DATA.userToken, title: false
        });
    expect(response.statusCode).toBe(400);
  });

  test("Responds with a 404 if it cannot find the job in question", async function () {
    // delete job first
    await request(app)
        .delete(`/jobs/${TEST_DATA.jobId}`).send({
          _token: TEST_DATA.userToken, title: "instructor"
        });
    const response = await request(app)
        .patch(`/jobs/${TEST_DATA.jobId}`)
        .send({
          _token: TEST_DATA.userToken, title: "instructor"
        });
    expect(response.statusCode).toBe(404);
  });
});


describe("DELETE /jobs/:id", function () {
  test("Deletes a single a job", async function () {
    const response = await request(app)
        .delete(`/jobs/${TEST_DATA.jobId}`).send({_token: TEST_DATA.userToken})
    expect(response.body).toEqual({message: "job deleted"});
  });


  test("Responds with a 404 if it cannot find the job in question", async function () {
    // delete job first
    await request(app)
        .delete(`/jobs/${TEST_DATA.jobId}`).send({_token: TEST_DATA.userToken})
    const response = await request(app)
        .delete(`/jobs/${TEST_DATA.jobId}`).send({_token: TEST_DATA.userToken})
    expect(response.statusCode).toBe(404);
  });
});


afterEach(async function () {
  await afterEachHook();
});


afterAll(async function () {
  await afterAllHook();
});