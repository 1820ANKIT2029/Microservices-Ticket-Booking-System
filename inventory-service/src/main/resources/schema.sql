CREATE TYPE item_status AS ENUM ('AVAILABLE', 'RESERVED', 'BOOKED');

CREATE TABLE IF NOT EXISTS `venues` (
    `id` SERIAL PRIMARY KEY,
    `name` VARCHAR(255) NOT NULL,
    `description` TEXT,
    `address_line1` VARCHAR(255),
    `city` VARCHAR(100),
    `state` VARCHAR(100),
    `country` VARCHAR(100),
    `postal_code` VARCHAR(20),

    `longitude` DECIMAL(9, 6),
    `latitude` DECIMAL(8, 6),

    `timezone` VARCHAR(100),
    `total_capacity` INT,
    `website_url` VARCHAR(2048),

    `map_width` DECIMAL(10,2),
    `map_height` DECIMAL(10,2),

    `amenities` TEXT,
    `is_active` BOOLEAN DEFAULT TRUE,
    `created_at` TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS `venue_sections` (
    `id` SERIAL PRIMARY KEY,
    `venue_id` INT NOT NULL,
    `name` VARCHAR(255) NOT NULL,
    `description` TEXT,
    `section_type` VARCHAR(100),

    `x` DECIMAL(10,2) NOT NULL,
    `y` DECIMAL(10,2) NOT NULL,
    `width` DECIMAL(10,2),
    `height` DECIMAL(10,2),
    `rotation` DECIMAL(5,2) DEFAULT 0,

    `total_seats` INT,
    FOREIGN KEY (`venue_id`) REFERENCES `venues` (`id`) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS `seats` (
    `id` SERIAL PRIMARY KEY,
    `venue_section_id` INT NOT NULL,
    `venue_id` INT NOT NULL,
    `seat_number` VARCHAR(50) NOT NULL,
    `row_label` VARCHAR(50),
    `seat_type` VARCHAR(100),

    `x` DECIMAL(10,2) NOT NULL,
    `y` DECIMAL(10,2) NOT NULL,
    `width` DECIMAL(10,2) NOT NULL DEFAULT 24,
    `height` DECIMAL(10,2) NOT NULL DEFAULT 24,
    `rotation` DECIMAL(5,2) DEFAULT 0,
    `shape` VARCHAR(20) DEFAULT 'circle',

    `is_accessible` BOOLEAN DEFAULT FALSE,
    `is_active` BOOLEAN DEFAULT TRUE,
    FOREIGN KEY (`venue_section_id`) REFERENCES `venue_sections` (`id`) ON DELETE CASCADE,
    FOREIGN KEY (`venue_id`) REFERENCES `venues` (`id`) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS `session_seats` (
    `id` SERIAL PRIMARY KEY,
    `event_session_id` INT NOT NULL,
    `seat_id` INT NOT NULL,

    `locked_by` VARCHAR(100),
    `locked_until` TIMESTAMP WITH TIME ZONE,

    `override_price` DECIMAL(10, 2),
    status item_status DEFAULT 'AVAILABLE', -- e.g., AVAILABLE, RESERVED, SOLD

    UNIQUE(event_session_id, seat_id),
    FOREIGN KEY (`seat_id`) REFERENCES `seats` (`id`) ON DELETE CASCADE
);