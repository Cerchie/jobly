\c jobly

DROP TABLE IF EXISTS companies CASCADE;
DROP TABLE IF EXISTS jobs;
DROP TABLE IF EXISTS users;
CREATE TABLE companies (
  handle text PRIMARY KEY,
  name text NOT NULL,
  num_employees integer,
  description text,
  logo_url text
);


CREATE TABLE jobs(
    id SERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    salary FLOAT,
    equity FLOAT CHECK(equity <= 1.0),
    company_handle TEXT NOT NULL REFERENCES companies ON DELETE CASCADE
);

CREATE TABLE users (
  username TEXT PRIMARY KEY,
  password TEXT NOT NULL,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  photo_url TEXT,
  is_admin BOOLEAN NOT NULL DEFAULT FALSE
);

INSERT INTO companies (handle, name, num_employees, description, logo_url)
VALUES (
    'Pear',
    'Pear Corporation',
    34,
    'Sends French pears to unsuspecting relatives',
    'https://freeiconshop.com/wp-content/uploads/edd/pear-outline-filled.png'
);

INSERT INTO companies (handle, name, num_employees, description, logo_url)
VALUES (
    'Apple',
    'Apple Corporation',
    34,
    'Sends French apples to unsuspecting relatives',
    'https://freeiconshop.com/wp-content/uploads/edd/pear-outline-filled.png'
);

INSERT INTO companies (handle, name, num_employees, description, logo_url)
VALUES (
    'Peach',
    'Peach Corporation',
    34,
    'Sends French peaches to unsuspecting relatives',
    'https://freeiconshop.com/wp-content/uploads/edd/pear-outline-filled.png'
);

INSERT INTO jobs (id, title, salary, equity, company_handle)
VALUES (    
  999,
  'Pear Polisher',
    34000,
    .4,
    'Pear'
),
 (    
  998,
  'Apple Polisher',
    34000,
    .3,
    'Apple'
),
(    
  997,
  'Peach Polisher',
    34000,
    .2,
    'Peach'
);

INSERT INTO users (username, password, first_name, last_name, email, photo_url, is_admin)
VALUES ('Fishy',
   'jafbv345',
   'Fish',
   'Fisherson',
   'fish@gmail.com',
   'gags',
   'true'
), 
('Caty',
   'jaf45',
   'Cat',
   'Caterson',
   'cat@gmail.com',
   'alfk',
   'false'
), 
('dogy',
   'jaf45',
   'dog',
   'dogerson',
   'dog@gmail.com',
   'alfk',
   'false'
)



