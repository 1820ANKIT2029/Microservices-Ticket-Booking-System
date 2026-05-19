-- ENUM types
CREATE TYPE user_role AS ENUM ('CONSUMER', 'ORGANIZER', 'ADMIN');
CREATE TYPE session_status AS ENUM ('ACTIVE', 'EXPIRED', 'REVOKED');

CREATE TABLE IF NOT EXISTS `users` (
    `id` SERIAL PRIMARY KEY,
    `user_id` VARCHAR(100) NOT NULL UNIQUE,
    `first_name` VARCHAR(100) NOT NULL,
    `last_name` VARCHAR(100) NOT NULL,
    `email` VARCHAR(255) NOT NULL UNIQUE,
    `phone_number` VARCHAR(20),
    `hashed_password` VARCHAR(255) NOT NULL,
    `avatar_url` VARCHAR(2048),
    `role` user_role DEFAULT 'CONSUMER',
    `is_active` BOOLEAN DEFAULT TRUE,
    `last_login_at` TIMESTAMP WITH TIME ZONE,
    `created_at` TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS `user_sessions` (
    `id` SERIAL PRIMARY KEY,
    `user_id` INT NOT NULL,
    `token` VARCHAR(500) NOT NULL UNIQUE,
    `device_info` TEXT,
    `ip_address` VARCHAR(45),
    `status` session_status DEFAULT 'ACTIVE',
    `expires_at` TIMESTAMP WITH TIME ZONE NOT NULL,
    `created_at` TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
);