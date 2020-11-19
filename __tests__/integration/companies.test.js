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

///testing post to companies
describe("POST /companies", function () {
  test("Creates a new company", async function () {
    const response = await request(app)
        .post(`/companies`)
        .send({
          _token: TEST_DATA.userToken,
          handle: TEST_DATA.currentCompany.handle,
          name: "TestComp2",
          num_employees: 1000000,
          description: "testingcomp2",
          logo_url: "logourlsforcomp2"
        });
    expect(response.statusCode).toBe(201);
    expect(response.body.company).toHaveProperty("handle");
    expect(response.body.company).toHaveProperty("name");
  }); });

///testing get to companies
describe("GET /companies/:handle", function () {
    test("Gets a single company", async function () {
      const response = await request(app).get(`/companies/${TEST_DATA.currentCompany.handle}`).send({_token: TEST_DATA.userToken});
      expect(response.body.company).toHaveProperty("handle");
  
      expect(response.body.company.handle).toBe(TEST_DATA.currentCompany.handle);
    });
  
    test("Responds with a 404 if it cannot find the company in question", async function () {
      const response = await request(app)
          .get(`/companies/999`).send({_token: TEST_DATA.userToken})
      expect(response.statusCode).toBe(404);
    });
  });

  describe("GET /companies", function () {
    test("Gets a list of 1 company", async function () {
      const response = await request(app).get(`/companies`);
      const companies = response.body.companies;
      expect(companies).toHaveLength(1);
      expect(companies[0]).toHaveProperty("company_handle");
      expect(companies[0]).toHaveProperty("title");
    });
  
    test("Has working search", async function () {
      await request(app)
          .post(`/companies`)
          .send({
            handle: TEST_DATA.currentCompany.handle,
            name: TEST_DATA.currentCompany.name,
            num_employees: TEST_DATA.currentCompany.num_employees,
            description: TEST_DATA.currentCompany.description,
            _token: TEST_DATA.userToken
          });
  
      const response = await request(app)
          .get(`/companies?search=${TEST_DATA.currentCompany.handle}`)
          .send({_token: TEST_DATA.userToken});
      expect(response.body.companies).toHaveLength(1);
      expect(response.body.companies[0]).toHaveProperty("handle");
      expect(response.body.companies[0]).toHaveProperty("name");
    });
  });

///testing patch to companies
describe("PATCH /companies/:handle", function () {
    test("Updates a single a company's title", async function () {
      const response = await request(app)
          .patch(`/companies/${TEST_DATA.currentCompany.handle}`)
          .send({name: "xkcd", _token: TEST_DATA.userToken});
      expect(response.body.company).toHaveProperty("handle");
  
      expect(response.body.company.name).toBe("xkcd");
      expect(response.body.company.handle).not.toBe(null);
    });
  
    test("Updates a single a company's equity", async function () {
      const response = await request(app)
          .patch(`/companies/${TEST_DATA.currentCompany.handle}`)
          .send({
            _token: TEST_DATA.userToken, num_employees: 4444
          });
      expect(response.body.company).toHaveProperty("handle");
    });
  
    test("Prevents a bad company update", async function () {
      const response = await request(app)
          .patch(`/companies/${TEST_DATA.currentCompany.handle}`)
          .send({
            _token: TEST_DATA.userToken, cactus: false
          });
      expect(response.statusCode).toBe(400);
    });
  
    test("Responds with a 404 if it cannot find the company in question", async function () {
      // delete company first
      await request(app)
          .delete(`/companies/${TEST_DATA.currentCompany.handle}`).send({
            _token: TEST_DATA.userToken, name: `${currentCompany.name}`
          });
      const response = await request(app)
          .patch(`/companies/${TEST_DATA.currentCompany.handle}`)
          .send({
            _token: TEST_DATA.userToken, name: "badname"
          });
      expect(response.statusCode).toBe(404);
    });
  });
  
///testing delete to companies

describe("DELETE /companies/:handle", function () {
    test("Deletes a single company", async function () {
      const response = await request(app)
          .delete(`/companies/${TEST_DATA.currentCompany.handle}`).send({_token: TEST_DATA.userToken})
      expect(response.body).toEqual({message: "Company deleted"});
    });
  
  
    test("Responds with a 404 if it cannot find the company in question", async function () {
      // delete company first
      await request(app)
          .delete(`/companies/${TEST_DATA.currentCompany.badhandle}`).send({_token: TEST_DATA.userToken})
      const response = await request(app)
          .delete(`/companies/${TEST_DATA.currentCompany.badhandle}`).send({_token: TEST_DATA.userToken})
      expect(response.statusCode).toBe(404);
    });
  });
  
afterEach(async function () {
    await afterEachHook();
  });
  
  
  afterAll(async function () {
    await afterAllHook();
  });