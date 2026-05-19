CREATE TABLE IF NOT EXISTS `users` (
    `user_id` BIGINT PRIMARY KEY AUTO_INCREMENT,

    `first_name` VARCHAR(100) NOT NULL,
    `last_name` VARCHAR(100) NOT NULL,

    `email` VARCHAR(255) NOT NULL UNIQUE,
    `phone_number` VARCHAR(20) UNIQUE,

    `hashed_password` VARCHAR(255) NOT NULL,

    role ENUM('CONSUMER', 'ORGANIZER', 'ADMIN')
        NOT NULL DEFAULT 'CONSUMER',

    `avatar_url` VARCHAR(500),

    `is_active` BOOLEAN DEFAULT TRUE,

    `last_login_at` TIMESTAMP NULL,

    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP
);