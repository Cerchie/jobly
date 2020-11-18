/** Integration tests for companies routes */

process.env.NODE_ENV = "test"

const request = require("supertest");


const app = require("../../app");
const db = require("../../db");


// username of sample user
let user_username;


beforeEach(async () => {
  let result = await db.query(`
    INSERT INTO 
      users (username, password, first_name, last_name, email, photo_url, is_admin)   
      VALUES (
        'Sue123', 
        'alkhg', 
        'Sue', 
        'Smith', 
        'S@gmail.com',
        'none',
        'false')
      RETURNING username`);

  user_username = result.rows[0].username
});

describe("GET /user", function () {
    test("Gets a list of 1 company", async function () {
      const response = await request(app).get(`/users`);
      const user = response.body.user;
      expect(user).toHaveLength(1);
      expect(user[0]).toHaveProperty("username");
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
//testing get by handle route
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
///testing patch route 
    describe("PATCH /companies/:handle", function () {
      test("Updates a single company", async function () {
        const response = await request(app)
            .put(`/companies/${company_handle}`)
            .send({
              handle: "Pear",
              name: "Pear Corp",
              num_employees: 52,
              logo_url: "https://media.keyshot.com/uploads/2018/10/keyshot-icon-256.png"
            });
        expect(response.body.company).toHaveProperty("handle");
        expect(response.body.company.name).toBe("Pear Corp");
      });
    
      test("Prevents a bad company update", async function () {
        const response = await request(app)
            .put(`/companies/${company_handle}`)
            .send({
              handle: "Pear",
              badField: "do not add me",
              name: "Pear Corp",
              num_employees: 52,
              logo_url: "https://media.keyshot.com/uploads/2018/10/keyshot-icon-256.png"
            });
        expect(response.statusCode).toBe(404);
      });
    
      test("Responds 404 if can't find company in question", async function () {
        // delete company first
        await request(app)
            .delete(`/companies/${company_handle}`)
        const response = await request(app).delete(`/companies/${company_handle}`);
        expect(response.statusCode).toBe(404);
      });
    });
///testing delete route
    describe("DELETE /companies/:handle", function () {
      test("Deletes a single company by handle", async function () {
        const response = await request(app)
            .delete(`/companies/${company_handle}`)
        expect(response.body).toEqual({message: "company deleted"});
      });
    });

afterEach(async function () {
  await db.query("DELETE FROM COMPANIES");
});


afterAll(async function () {
  await db.end()
});