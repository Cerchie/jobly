const db = require("../db");
const sqlForPartialUpdate = require("../helpers/partialUpdate.js")
const ExpressError = require("../helpers/ExpressError");
/** Collection of related methods for jobs. */

class Job {
    static async findAll(data) {
        let baseQuery = `SELECT id, title FROM jobs`; //setting baseQuery
        let whereExpressions = []; //setting empty array
        let queryValues = []; //setting query vals to empty array
    
        // For each possible search term, add to whereExpressions and
        // queryValues so we can generate the right SQL
    
        if (data.min_salary) {
          queryValues.push(+data.min_salary);
          whereExpressions.push(`salary >= $${(queryValues.length)}`);
        }
    
        if (data.min_equity) {
          queryValues.push(+data.min_equity);
          whereExpressions.push(`equity >= $${queryValues.length}`);
        }
    
        if (data.search) {
          queryValues.push(`%${data.search}%`);
          whereExpressions.push(`title ILIKE $${queryValues.length}`);
        }
    
        if (whereExpressions.length > 0) {
          baseQuery += " WHERE ";
        }
    
        // Finalize query and return results
    
        let finalQuery =
          baseQuery + whereExpressions.join(" AND ") + " ORDER BY title";
        const jobsRes = await db.query(finalQuery, queryValues);
        return jobsRes.rows;
      }

    static async findOne(id) {
        const jobRes = await db.query(
            `SELECT id,
                    title,
                    salary,
                    equity,
                    company_handle
                FROM jobs 
                WHERE id = $1`, [id]);
    
                const job = jobRes.rows[0];

                if (!job) {
                  throw new ExpressError(`There exists no job '${id}'`, 404);
                }
            
                const companiesRes = await db.query(
                  `SELECT name, num_employees, description, logo_url 
                    FROM companies 
                    WHERE handle = $1`,
                  [job.company_handle]
                );
            
                job.company = companiesRes.rows[0];
            
                return job;
              }
      /** create job in database from data, return job data:
       *
       * { id, title,salary, equity, company_handle
       *
       * => {id, title,salary, equity, company_handle}
       *
       * */
    
      static async create(data) {
        const result = await db.query(
          `INSERT INTO jobs (title, salary, equity, company_handle) 
            VALUES ($1, $2, $3, $4) 
            RETURNING id, title, salary, equity, company_handle`,
          [data.title, data.salary, data.equity, data.company_handle]
        );
    
        return result.rows[0];
      }
      /** Update data with matching ID to data, return updated job.
       * {id, title,salary, equity, company_handle, }
       *
{id, title,salary, equity, company_handle, }
       *
       * */
    
      static async update(id, data) {
        let { query, values } = sqlForPartialUpdate(
          "jobs",
          data,
          "id",
          id
        );
       
        const result = await db.query(query, values);
        const job = result.rows[0];
    
        if (!job) {
          throw new ExpressError(`There exists no job '${id}`, 404);
        }
        return job;
      }
      /** remove job with matching handle. Returns undefined. */
    
      static async remove(id) {
        const result = await db.query(
          `DELETE FROM jobs 
             WHERE id = $1 
             RETURNING id`,
            [id]);
    
        if (result.rows.length === 0) {
          throw { message: `There is no job with the id '${id}`, status: 404 }
        }
      }
}

module.exports = Job;