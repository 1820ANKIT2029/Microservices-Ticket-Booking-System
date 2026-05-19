CREATE TABLE IF NOT EXISTS `bookings` (
    `id` SERIAL PRIMARY KEY,
    `booking_ref` VARCHAR(100) NOT NULL UNIQUE,
    `user_id` INT NOT NULL,          -- Logical link to User Service
    `event_session_id` INT NOT NULL,         -- Logical link to Event Service
    `status` VARCHAR(50) DEFAULT 'PENDING', -- PENDING, CONFIRMED, CANCELLED, EXPIRED
    `ticket_count` INT DEFAULT 0,
    `subtotal` DECIMAL(10, 2) NOT NULL,
    `tax_amount` DECIMAL(10, 2) DEFAULT 0.00,
    `total_amount` DECIMAL(10, 2) NOT NULL,
    `currency` VARCHAR(10) DEFAULT 'USD',
    `confirmed_at` TIMESTAMP WITH TIME ZONE,
    `cancelled_at` TIMESTAMP WITH TIME ZONE,
    `cancel_reason` TEXT,
    `created_at` TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS `tickets` (
    `id` SERIAL PRIMARY KEY,
    `booking_id` INT NOT NULL,
    `user_id` INT NOT NULL,          -- Logical link to User Service
    `event_session_id` INT NOT NULL, -- Logical link to Event Service
    `ticket_type_id` INT NOT NULL,   -- Logical link to Event Service
    `seat_id` INT,                   -- Logical link to Event Service (Null for general admission)
    `qr_code` VARCHAR(500),
    `bar_code` VARCHAR(500),
    `status` VARCHAR(50) DEFAULT 'RESERVED', -- RESERVED, VALID, USED, VOIDED
    `price_paid` DECIMAL(10, 2) NOT NULL,
    `is_checked` BOOLEAN DEFAULT FALSE,
    `issued_at` TIMESTAMP WITH TIME ZONE,
    `checked_in_at` TIMESTAMP WITH TIME ZONE,
    FOREIGN KEY (`booking_id`) REFERENCES `bookings` (`id`) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS `seat_locks` (
    `id` SERIAL PRIMARY KEY,
    `session_token` VARCHAR(500) NOT NULL, -- Ties back to booking window session
    `seat_id` INT NOT NULL,                -- Logical link to Event Service
    `event_session_id` INT NOT NULL,       -- Logical link to Event Service
    `user_id` INT NOT NULL,                -- Logical link to User Service
    `locked_at` TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    `expire_at` TIMESTAMP WITH TIME ZONE NOT NULL
);