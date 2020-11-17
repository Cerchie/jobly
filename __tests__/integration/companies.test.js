/** Integration tests for companies routes */

process.env.NODE_ENV = "test"

const request = require("supertest");


const app = require("../../app");
const db = require("../../db");


// handle of sample company
let company_handle;


beforeEach(async () => {
  let result = await db.query(`
    INSERT INTO 
      companies (handle, name, num_employees, description, logo_url)   
      VALUES (
        'Splash', 
        'Splash Zone', 
         100, 
        'Inflatable pool company', 
        'https://media.keyshot.com/uploads/2018/10/keyshot-icon-256.png')
      RETURNING handle`);

  company_handle = result.rows[0].handle
});

describe("GET /companies", function () {
    test("Gets a list of 1 company", async function () {
      const response = await request(app).get(`/companies`);
      const companies = response.body.companies;
      expect(companies).toHaveLength(1);
      expect(companies[0]).toHaveProperty("handle");
    });
  });
  
  describe("POST /companies",function () {
    test("Creates a new company", async function () {
      const response = await request(app)
          .post(`/companies`)
          .send({
            handle: 'Yummy',
            name: "Yummy Co.",
            num_employees: 888,
            description: "lollipop distribution centers",
            logo_url: "https://media.keyshot.com/uploads/2018/10/keyshot-icon-256.png"
          });
          
      expect(response.statusCode).toBe(201);
      expect(response.body.company).toHaveProperty("handle");
    
    }); });

    describe("GET /companies/:handle",  function () {
      test("Gets a single company by its handle", async function () {
        const response = await request(app)
            .get(`/companies/${company_handle}`)
        expect(response.body.company).toHaveProperty("handle");
        expect(response.body.company.handle).toBe(company_handle);
      });
    
      test("Responds with 404 if can't find company in question", async function () {
        const response = await request(app)
            .get(`/companies/'palantir'`)
        expect(response.statusCode).toBe(404);
      });
    });

afterEach(async function () {
  await db.query("DELETE FROM COMPANIES");
});


afterAll(async function () {
  await db.end()
});