CREATE TABLE IF NOT EXISTS `performers` (
    `id` SERIAL PRIMARY KEY,
    `name` VARCHAR(255) NOT NULL,
    `bio` TEXT,
    `genre` VARCHAR(100),
    `nationality` VARCHAR(100),
    `website_url` VARCHAR(2048),
    `image_url` VARCHAR(2048),
    `social_link1` VARCHAR(2048),
    `social_link2` VARCHAR(2048),
    `is_active` BOOLEAN DEFAULT TRUE,
    `created_at` TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    `modified_at` TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS `events` (
    `id` SERIAL PRIMARY KEY,

    `title` VARCHAR(255) NOT NULL,
    `slug` VARCHAR(255) NOT NULL UNIQUE,
    `description` TEXT,
    `status` VARCHAR(50),
    `event_type` VARCHAR(100),
    `min_age` INT,

    `venue_id` INT,
    `user_id` VARCHAR(100) NOT NULL, -- Logical reference to User Service `users.user_id`

    `banner_url` VARCHAR(2048),
    `poster_url` VARCHAR(2048),

    `is_multi_session` BOOLEAN DEFAULT FALSE,
    `is_featured` BOOLEAN DEFAULT FALSE,

    `created_at` TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS `event_performers` (
    `event_id` INT NOT NULL,
    `performer_id` INT NOT NULL,
    `created_at` TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    `modified_at` TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`event_id`, `performer_id`),
    FOREIGN KEY (`event_id`) REFERENCES `events` (`id`) ON DELETE CASCADE,
    FOREIGN KEY (`performer_id`) REFERENCES `performers` (`id`) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS `event_sessions` (
    `id` SERIAL PRIMARY KEY,
    `event_id` INT NOT NULL,
    `venue_id` INT,

    `title` VARCHAR(255),
    `description` TEXT,

    `status` VARCHAR(50),

    `stream_url` VARCHAR(2048),
    `language` VARCHAR(100),

    `total_capacity` INT,
    `available_capacity` INT,
    `session_number` INT,
    `is_recorded` BOOLEAN DEFAULT FALSE,

    `start_data_time` TIMESTAMP WITH TIME ZONE,
    `end_data_time` TIMESTAMP WITH TIME ZONE,
    `created_at` TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (`event_id`) REFERENCES `events` (`id`) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS `ticket_types` (
    `id` SERIAL PRIMARY KEY,
    `event_session_id` INT NOT NULL,

    `name` VARCHAR(255) NOT NULL,
    `description` TEXT,

    `base_price` DECIMAL(10, 2) NOT NULL,

    `total_quantity` INT,
    `available_quantity` INT,
    `max_per_booking` INT,

    `is_active` BOOLEAN DEFAULT TRUE,
    `sale_start_at` TIMESTAMP WITH TIME ZONE,
    `sale_end_at` TIMESTAMP WITH TIME ZONE,

    FOREIGN KEY (`event_session_id`) REFERENCES `event_sessions` (`id`) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS `ticket_type_sections` (
    `ticket_type_id` INT NOT NULL,
    `venue_section_id` INT NOT NULL,

    PRIMARY KEY(ticket_type_id, venue_section_id),

    FOREIGN KEY (ticket_type_id)
        REFERENCES ticket_types(id)
        ON DELETE CASCADE
);