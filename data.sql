

CREATE TABLE companies (
  handle text PRIMARY KEY,
  name text NOT NULL,
  num_employees integer,
  description text,
  logo_url text
);


INSERT INTO companies (handle, name, num_employees, description, logo_url)
VALUES (
    'Pear',
    'Pear Corporation',
    34,
    'Sends French pears to unsuspecting relatives',
    'https://freeiconshop.com/wp-content/uploads/edd/pear-outline-filled.png'
);