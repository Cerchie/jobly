const db = require("../db");


/** Collection of related methods for companies. */

class Company {
    static async findAll(data) {
        let baseQuery = `SELECT handle, name FROM companies`; //setting baseQuery
        let whereExpressions = []; //setting empty array
        let queryValues = []; //setting query vals to empty array
    
        if (+data.min_employees >= +data.max_employees) {
          throw new ExpressError(
            "Min employees must be less than max employees",
            400
          );
        }
        // For each possible search term, add to whereExpressions and
        // queryValues so we can generate the right SQL
    
        if (data.min_employees) {
          queryValues.push(+data.min_employees);
          whereExpressions.push(`(num_employees + 1) >= $${(queryValues.length)}`);
        }
    
        if (data.max_employees) {
          queryValues.push(+data.max_employees);
          whereExpressions.push(`num_employees <= $${queryValues.length}`);
        }
    
        if (data.search) {
          queryValues.push(`%${data.search}%`);
          whereExpressions.push(`name ILIKE $${queryValues.length}`);
        }
    
        if (whereExpressions.length > 0) {
          baseQuery += " WHERE ";
        }
    
        // Finalize query and return results
    
        let finalQuery =
          baseQuery + whereExpressions.join(" AND ") + " ORDER BY name";
        const companiesRes = await db.query(finalQuery, queryValues);
        return companiesRes.rows;
      }

    static async findOne(handle) {
        const companyRes = await db.query(
            `SELECT handle,
                    name,
                    num_employees,
                    description,
                    logo_url
                FROM companies 
                WHERE handle = $1`, [handle]);
    
        if (companyRes.rows.length === 0) {
          throw { message: `There is no company with handle '${handle}`, status: 404 }
        }
    
        return companyRes.rows[0];
      }

      /** create company in database from data, return company data:
       *
       * { handle, name, num_employees, description, logo_url}
       *
       * => { handle, name, num_employees, description, logo_url}
       *
       * */
    
      static async create(data) {
        const result = await db.query(
          `INSERT INTO companies (handle, name, num_employees, description, logo_url) 
             VALUES ($1, $2, $3, $4, $5) 
             RETURNING  handle, name, num_employees, description, logo_url`,
          [
            data.handle,
            data.name,
            data.num_employees,
            data.description,
            data.logo_url
          ]
        );
    
        return result.rows[0];
      }
    
      /** Update data with matching ID to data, return updated company.
       * {handle, name, num_employees, description, logo_url}
       *
handle, name, num_employees, description, logo_url}
       *
       * */
    
      static async update(handle, data) {
        const result = await db.query(
          `UPDATE companies SET 
                name=($1),
                num_employees=($2),
                description=($3),
                logo_url=($4),
                WHERE handle=$5
            RETURNING handle,
                      name,
                      num_employees,
                      description,
                      logo_url`,
          [
            data.name,
            data.num_employees,
            data.description,
            data.logo_url,
            handle
          ]
        );
    
        if (result.rows.length === 0) {
          throw { message: `There is no company with an handle '${handle}`, status: 404 }
        }
    
        return result.rows[0];
      }
    
      /** remove company with matching handle. Returns undefined. */
    
      static async remove(handle) {
        const result = await db.query(
          `DELETE FROM companies 
             WHERE handle = $1 
             RETURNING handle`,
            [handle]);
    
        if (result.rows.length === 0) {
          throw { message: `There is no company with the handle '${handle}`, status: 404 }
        }
      }
}

module.exports = Company;