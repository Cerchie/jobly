/** Integration tests for users routes */

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
    test("Gets a list of 1 user", async function () {
      const response = await request(app).get(`/users`);
      const user = response.body.user;
      expect(user).toHaveLength(1);
      expect(user[0]).toHaveProperty("username");
    });
  });
  
  describe("POST /users",function () {
    test("Creates a new user", async function () {
      const response = await request(app)
          .post(`/users`)
          .send({
            username: 'Yummy123',
            password: 'Yummy2451Coajksvf.',
            first_name:'first',
            last_name: 'last',
            email: 'a@gmail.com',
            photo_url: 'none',
            is_admin: 'false'
          });
          
      expect(response.statusCode).toBe(201);
      expect(response.body.user).toHaveProperty("username");
    
    }); });
//testing get by username route
    describe("GET /users/:username",  function () {
      test("Gets a single user by its username", async function () {
        const response = await request(app)
            .get(`/users/${user_username}`)
        expect(response.body.user).toHaveProperty("username");
        expect(response.body.user.username).toBe(user_username);
      });
    
      test("Responds with 404 if can't find user in question", async function () {
        const response = await request(app)
            .get(`/users/'palantir'`)
        expect(response.statusCode).toBe(404);
      });
    });
///testing patch route 
    describe("PATCH /users/:username", function () {
      test("Updates a single user", async function () {
        const response = await request(app)
            .put(`/users/${user_username}`)
            .send({
              username: 'Pear',
              password: 'PearafCorp',
              first_name: '52',
              last_name: 'h25',
              email: '5@gmail.com',
              is_admin: 'true'
            });
        expect(response.body.user).toHaveProperty('username');
        expect(response.body.user.username).toBe('Pear');
      });
    
      test("Prevents a bad user update", async function () {
        const response = await request(app)
            .put(`/users/${user_username}`)
            .send({
              username: 'Pear',
              badField: "do not add me"
            });
        expect(response.statusCode).toBe(404);
      });
    
      test("Responds 404 if can't find user in question", async function () {
        // delete userfirst
        await request(app)
            .delete(`/users/${user_username}`)
        const response = await request(app).delete(`/users/${user_username}`);
        expect(response.statusCode).toBe(404);
      });
    });
///testing delete route
    describe("DELETE /users/:username", function () {
      test("Deletes a single user by username", async function () {
        const response = await request(app)
            .delete(`/users/${user_username}`)
        expect(response.body).toEqual({message: "user deleted"});
      });
    });

afterEach(async function () {
  await db.query("DELETE FROM USERS");
});


afterAll(async function () {
  await db.end()
});