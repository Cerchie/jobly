const db = require("../db");


/** Collection of related methods for companies. */

class Company {

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
    
      /** Return array of company data:
       *
       * => [ {handle, name, num_employees, description, logo_url}, ... ]
       *
       * */
    
      static async findAll() {
        const companiesRes = await db.query(
            `SELECT 
                handle,
                name,
                num_employees,
                description,
                logo_url
                FROM companies 
                ORDER BY name`);
    
        return companiesRes.rows;
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
          `INSERT INTO companies ( handle, name, num_employees, description, logo_url) 
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