
-- DROP TABLE IF EXISTS users;
-- DROP TABLE IF EXISTS trains;
-- DROP TABLE IF EXISTS booking_agents;

-- DROP TABLE IF EXISTS passengers;
-- DROP TABLE IF EXISTS tickets;

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
		
CREATE TABLE IF NOT EXISTS
        booking_agents(
          id UUID PRIMARY KEY,
          credit_card VARCHAR(128) NOT NULL,
          address VARCHAR(128) NOT NULL,
		  created_date TIMESTAMP,
		  FOREIGN KEY (id) REFERENCES users(id)
        );
		
CREATE TABLE IF NOT EXISTS
        tickets(
          id UUID PRIMARY KEY,
          number_of_passengers INT NOT NULL,
          booked_by UUID,
		  train_id UUID,
		  status VARCHAR(5) NOT NULL,
		  created_date TIMESTAMP,
		  FOREIGN KEY (train_id) REFERENCES trains(id),
		  FOREIGN KEY (booked_by) REFERENCES booking_agents(id)
        );
		
CREATE TABLE IF NOT EXISTS
        passengers(
		  id UUID PRIMARY KEY,
          ticket_id UUID NOT NULL,
          train_id UUID NOT NULL,
          passenger_name VARCHAR(128) NOT NULL,
		  age INT NOT NULL,
		  gender VARCHAR(1) NOT NULL,
		  seat_number INT NOT NULL,
		  coach_number INT NOT NULL,
		  FOREIGN KEY (ticket_id) REFERENCES tickets(id),
		  FOREIGN KEY (train_id) REFERENCES trains(id)
        );
		
CREATE TABLE IF NOT EXISTS
        train_status(
		  train_id UUID PRIMARY KEY,
          ac_seat_count_left INT NOT NULL,
		  sl_seat_count_left INT NOT NULL,
          created_date TIMESTAMP,
          modified_date TIMESTAMP,
		  FOREIGN KEY (train_id) REFERENCES trains(id) ON DELETE CASCADE
        );
-- SELECT * FROM train_status;
-- SELECT * FROM booking_agents;
-- Select * from users;
Select * from tickets;
-- Select * from trains;