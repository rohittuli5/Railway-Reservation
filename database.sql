
DROP TABLE IF EXISTS users;

CREATE TABLE IF NOT EXISTS
      users(
        id UUID PRIMARY KEY,
        email VARCHAR(128) UNIQUE NOT NULL,
        password VARCHAR(128) NOT NULL,
		user_type VARCHAR(128) NOT NULL,
        created_date TIMESTAMP,
        modified_date TIMESTAMP
		
      );
	  
DROP TABLE IF EXISTS hello;
Create table hello(id VARCHAR(128));
insert into hello(id) values('hello');
insert into hello(id) values('hello1');
insert into hello(id) values('hello2');
SELECT * from hello;
