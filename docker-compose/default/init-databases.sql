
-- Create all Databases and Users First
CREATE DATABASE user_db;
CREATE DATABASE event_db;
CREATE DATABASE inventory_db;
CREATE DATABASE booking_db;
CREATE DATABASE payment_db;
CREATE DATABASE notification_db;

CREATE USER user_service_user WITH ENCRYPTED PASSWORD 'user_service_user';
CREATE USER event_service_user WITH ENCRYPTED PASSWORD 'event_service_user';
CREATE USER inventory_service_user WITH ENCRYPTED PASSWORD 'inventory_service_user';
CREATE USER booking_service_user WITH ENCRYPTED PASSWORD 'booking_service_user';
CREATE USER payment_service_user WITH ENCRYPTED PASSWORD 'payment_service_user';
CREATE USER notification_service_user WITH ENCRYPTED PASSWORD 'notification_service_user';

-- Connect to each DB & Grant Schema Perms

-- Switch to user_db
\c user_db
GRANT ALL PRIVILEGES ON DATABASE user_db TO user_service_user;
GRANT USAGE, CREATE ON SCHEMA public TO user_service_user;

-- Switch to event_db
\c event_db
GRANT ALL PRIVILEGES ON DATABASE event_db TO event_service_user;
GRANT USAGE, CREATE ON SCHEMA public TO event_service_user;

-- Switch to inventory_db
\c inventory_db
GRANT ALL PRIVILEGES ON DATABASE inventory_db TO inventory_service_user;
GRANT USAGE, CREATE ON SCHEMA public TO inventory_service_user;

-- Switch to booking_db
\c booking_db
GRANT ALL PRIVILEGES ON DATABASE booking_db TO booking_service_user;
GRANT USAGE, CREATE ON SCHEMA public TO booking_service_user;

-- Switch to payment_db
\c payment_db
GRANT ALL PRIVILEGES ON DATABASE payment_db TO payment_service_user;
GRANT USAGE, CREATE ON SCHEMA public TO payment_service_user;

-- Switch to notification_db
\c notification_db
GRANT ALL PRIVILEGES ON DATABASE notification_db TO notification_service_user;
GRANT USAGE, CREATE ON SCHEMA public TO notification_service_user;