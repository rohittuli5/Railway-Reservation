
-- DROP TABLE IF EXISTS users;
-- DROP TABLE IF EXISTS trains;

CREATE TABLE IF NOT EXISTS
      users(
        id UUID PRIMARY KEY,
        email VARCHAR(128) UNIQUE NOT NULL,
        password VARCHAR(128) NOT NULL,
		user_type VARCHAR(128) NOT NULL,
        created_date TIMESTAMP,
        modified_date TIMESTAMP
		
      );
	  
	  
	  
CREATE TABLE IF NOT EXISTS
        trains(
          id UUID PRIMARY KEY,
          train_name VARCHAR(128) UNIQUE NOT NULL,
          ac_coach_count INT NOT NULL,
          sl_coach_count INT NOT NULL,
          schedule_date TIMESTAMP,
		  create_date TIMESTAMP
        );
	  


