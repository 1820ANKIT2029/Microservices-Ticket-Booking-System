CREATE TABLE IF NOT EXISTS `notifications` (
    `id` SERIAL PRIMARY KEY,
    `name` VARCHAR(255) NOT NULL,
    `channel` VARCHAR(50) NOT NULL,            -- e.g., EMAIL, SMS, PUSH
    `type` VARCHAR(100),                       -- e.g., BOOKING_CONFIRMATION, PAYMENT_FAILED
    `subject` VARCHAR(255),
    `body_text` TEXT,
    `body_html` TEXT,
    `is_active` BOOLEAN DEFAULT TRUE,
    `user_id` INT NOT NULL,
    `created_at` TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);