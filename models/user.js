const db = require("../db");
const sqlForPartialUpdate = require("../helpers/partialUpdate.js")
const bcrypt = require("bcrypt");
/** Collection of related methods for users. */

class User {

  /** Return array of user data:
   *
   * => [ {username, password, first_name, last_name, email, photo_url, is_admin}, ... ]
   *
   * */

  static async findAll() {
    const usersRes = await db.query(
        `SELECT 
        username,
        first_name, 
        last_name, 
        email,
            FROM users 
            ORDER BY username`);

    return usersRes.rows;
  }

//method for finding one user by username
    static async findOne(username) {
        const userRes = await db.query(
            `SELECT
            username,
            first_name, 
            last_name,
            photo_url
                FROM users 
                WHERE username = $1`, [username]);
    
        if (userRes.rows.length === 0) {
          throw { message: `There is no user with username '${username}`, status: 404 }
        }
        const user = userRes.rows[0];
    
        if (!user) {
          throw new ExpressError(`There exists no user '${username}'`, 404);
        }

        return user;
      }

      /** create user in database from data, return user data:
       *
       * { username, password, first_name, last_name, email, photo_url, is_admin}}
       *
       * => { username, password, first_name, last_name, email, photo_url, is_admin}}
       *
       * */
    
      static async create(data) {
        const hashedPassword = await bcrypt.hash(data.password, BCRYPT_WORK_FACTOR);
        const result = await db.query(
          `INSERT INTO users (username, password, first_name, last_name, email, photo_url) 
             VALUES ($1, $2, $3, $4, $5, $6) 
             RETURNING username, password, first_name, last_name, email, photo_url`,
          [
            data.username,
            hashedPassword,
            data.first_name,
            data.last_name,
            data.email,
            data.photo_url
          ]
        );
    
        return result.rows[0];
      }
    
      /** Update data with matching ID to data, return updated user.
       * {username, first_name, last_name, email, photo_url, is_admin}
       *
 {username, first_name, last_name, email, photo_url, is_admin}}
       *
       * */
    
      static async update(username, data) {
        let { query, values } = sqlForPartialUpdate(
          "users",
          data,
          "username",
          username
        );
  
        const result = await db.query(query, values);
        const user = result.rows[0];
    
        if (!user) {
          throw new ExpressError(`There exists no user '${username}`, 404);
        }
        return user;
      }
      /** remove user with matching username. Returns undefined. */
    
      static async remove(username) {
        const result = await db.query(
          `DELETE FROM users 
             WHERE username = $1 
             RETURNING username`,
            [username]);
    
        if (result.rows.length === 0) {
          throw { message: `There is no user with the username '${username}`, status: 404 }
        }
      }

/** Authenticate: is this username/password valid? Returns boolean. */

  static async authenticate(data) {
    // try to find the user first
    const result = await db.query(
      `SELECT username, 
              password, 
              first_name, 
              last_name, 
              email, 
              photo_url, 
              is_admin
        FROM users 
        WHERE username = $1`,
      [data.username]
    );

    const user = result.rows[0];

    if (user) {
      // compare hashed password to a new hash from password
      const isValid = await bcrypt.compare(data.password, user.password);
      if (isValid) {
        return user;
      }
    }

    throw ExpressError("Invalid Password", 401);
  }

} 

module.exports = User;