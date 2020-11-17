\c jobly

DROP TABLE IF EXISTS companies CASCADE;
DROP TABLE IF EXISTS jobs;

CREATE TABLE companies (
  handle text PRIMARY KEY,
  name text NOT NULL,
  num_employees integer,
  description text,
  logo_url text
);

CREATE TABLE jobs (
  id INTEGER PRIMARY KEY,
  title TEXT NOT NULL,
  salary FLOAT NOT NULL,
  equity FLOAT NOT NULL CHECK (equity < 1),
  company_handle TEXT NOT NULL REFERENCES companies ON DELETE CASCADE,
  date_posted DATE DEFAULT NOW() 
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

INSERT INTO jobs (id, title, salary, equity, company_handle, date_posted)
VALUES (    
  999,
  'Pear Polisher',
    34000,
    .4,
    'Pear',
    '2020-09-09'
),
 (    
  998,
  'Apple Polisher',
    34000,
    .3,
    'Apple',
    '2020-08-08'
),
(    
  997,
  'Peach Polisher',
    34000,
    .2,
    'Peach',
    '2020-07-07'
);