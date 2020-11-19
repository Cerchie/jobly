// npm packages
const request = require('supertest');

// app imports
const app = require('../../app');

// model imports
const User = require('../../models/user');

const {
  TEST_DATA,
  afterEachHook,
  afterAllHook,
  beforeEachHook
} = require('./config');

beforeEach(async function() {
  await beforeEachHook(TEST_DATA);
});

afterEach(async function() {
  await afterEachHook();
});

afterAll(async function() {
  await afterAllHook();
});
//testing post to users
describe('POST /users', function() {
  test('Creates a new user', async function() {
    let dataObj = {
      username: 'whiskey',
      first_name: 'Whiskey',
      password: 'foo123',
      last_name: 'Lane',
      email: 'whiskey@rithmschool.com'
    };
    const response = await request(app)
      .post('/users')
      .send(dataObj);
    expect(response.statusCode).toBe(201);
    expect(response.body).toHaveProperty('token');
    const whiskeyInDb = await User.findOne('whiskey');
    ['username', 'first_name', 'last_name'].forEach(key => {
      expect(dataObj[key]).toEqual(whiskeyInDb[key]);
    });
  }); 

});

///testing get to users
describe("GET /users/:username", function () {
    test("Gets a single user", async function () {
      const response = await request(app).get(`/users/${TEST_DATA.currentUsername}`).send({_token: TEST_DATA.userToken});
      expect(response.body.user).toHaveProperty("username");
  
      expect(response.body.user.username).toBe(TEST_DATA.user.username);
    });
  
    test("Responds with a 404 if it cannot find the user in question", async function () {
      const response = await request(app)
          .get(`/users/blahblah`).send({_token: TEST_DATA.userToken})
      expect(response.statusCode).toBe(404);
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
  
///testing delete to users

describe('DELETE /users/:username', function() { //describe shows up in jest output to terminal
    test('Deletes a single a user', async function() { //setting up function
      const response = await request(app) //creating resp var with currUser and token input from TEST_DATA
        .delete(`/users/${TEST_DATA.currentUsername}`)
        .send({ _token: `${TEST_DATA.userToken}` });
      expect(response.body).toEqual({ message: 'User deleted' }); //expect to get the right deleted msg
    });
  
    test('Forbids a user from deleting another user', async function() {
      const response = await request(app) //resp with vars of different user with our own user token
        .delete(`/users/notme`)
        .send({ _token: `${TEST_DATA.userToken}` });
      expect(response.statusCode).toBe(401); //expect 401, not auth
    });
  
    test('Responds with a 404 if it cannot find the user in question', async function() {
      // delete user first
      await request(app)
        .delete(`/users/${TEST_DATA.currentUsername}`) //delete ourself first
        .send({ _token: `${TEST_DATA.userToken}` });
      const response = await request(app) //delete again
        .delete(`/users/${TEST_DATA.currentUsername}`)
        .send({ _token: `${TEST_DATA.userToken}` });
      expect(response.statusCode).toBe(404); //expect 404 not found
    });
  });
  
afterEach(async function () {
    await afterEachHook();
  });
  
  
  afterAll(async function () {
    await afterAllHook();
  });