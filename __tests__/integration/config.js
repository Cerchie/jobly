// npm packages
const request = require('supertest');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const jwt_decode = require('jwt-decode');
// app imports
const app = require('../../app');
const db = require('../../db');

// global auth variable to store things for all the tests
const TEST_DATA = {};

/**
 * Hooks to insert a user, company, and job, and to authenticate
 *  the user and the company for respective tokens that are stored
 *  in the input `testData` parameter.
 * @param {Object} TEST_DATA - build the TEST_DATA object
 */
async function beforeEachHook(TEST_DATA) {
  try {
    // login a user, get a token, store the user ID and token
    const hashedPassword = await bcrypt.hash('secret', 1); //creating a fake password
    await db.query(
      `INSERT INTO users (username, password, first_name, last_name, email, is_admin)
                  VALUES ('test', $1, 'tester', 'mctest', 'test@rithmschool.com', true)`,
      [hashedPassword] //inserting the test user
    );

    const response = await request(app)
      .post('/login')
      .send({
        username: 'test',
        password: 'secret'
      }); //logging in the test user

    TEST_DATA.userToken = response.body.token; //saving token in TEST_DATA
    TEST_DATA.currentUsername = jwt.decode(TEST_DATA.userToken).username; // saving usernane in TEST_DATA

    // do the same for company "companies"
    const result = await db.query(
      'INSERT INTO companies (handle, name, num_employees) VALUES ($1, $2, $3) RETURNING *',
      ['rithm', 'rithm inc', 1000]
    );

    TEST_DATA.currentCompany = result.rows[0];
//and create a new job
    const newJob = await db.query(
      "INSERT INTO jobs (title, salary, company_handle) VALUES ('Software Engineer', 100000, $1) RETURNING *",
      [TEST_DATA.currentCompany.handle]
    );
    TEST_DATA.jobId = newJob.rows[0].id;
//making sure to store test job in TEST_DATA
  } catch (error) {
    console.error(error);
  }
}

async function afterEachHook() {
  try {
    
    await db.query('DELETE FROM jobs');
    await db.query('DELETE FROM users');
    await db.query('DELETE FROM companies');
  } catch (error) {
    console.error(error);
  } //clearing up the db after each hook
}

async function afterAllHook() {
  try {
    await db.end();
  } catch (err) {
    console.error(err);
  }
} //ending test db

module.exports = {
  afterAllHook,
  afterEachHook,
  TEST_DATA,
  beforeEachHook
};