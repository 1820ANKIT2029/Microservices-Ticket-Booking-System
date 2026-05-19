CREATE TABLE IF NOT EXISTS `payment_methods` (
    `id` SERIAL PRIMARY KEY,
    `type` VARCHAR(50) NOT NULL,              -- e.g., CREDIT_CARD, GOOGLE_PAY, APPLE_PAY
    `gateway_customer_id` VARCHAR(255),       -- Customer token ID from the provider side
    `gateway_token_id` VARCHAR(255),          -- Payment instrument token
    `brand` VARCHAR(50),                      -- e.g., Visa, Mastercard
    `last4` VARCHAR(4),
    `expiry_year` INT,
    `is_default` BOOLEAN DEFAULT FALSE,
    `is_active` BOOLEAN DEFAULT TRUE,
    `user_id` VARCHAR(100) NOT NULL,          -- Logical connection to User Service
    `created_id` VARCHAR(100) NOT NULL
);

CREATE TABLE IF NOT EXISTS `payments` (
    `id` SERIAL PRIMARY KEY,
    `gateway_name` VARCHAR(100) NOT NULL,     -- e.g., STRIPE, PAYPAL
    `gateway_payment_id` VARCHAR(255) UNIQUE, -- Transaction reference from provider
    `gateway_order_id` VARCHAR(255),          -- Associated order record on provider
    `amount` DECIMAL(12, 2) NOT NULL,
    `currency` VARCHAR(10) DEFAULT 'USD',
    `status` VARCHAR(50) NOT NULL,            -- e.g., INITIATED, SUCCESS, FAILED
    `method` VARCHAR(50),                     -- Quick copy reference of the processing type
    `gateway_response` TEXT,                  -- Complete payload logging for debugging
    `payment_method_id` INT,
    `booking_id` INT NOT NULL,                -- Logical connection to Booking Service
    `user_id` VARCHAR(100) NOT NULL,          -- Logical connection to User Service
    `completed_id` VARCHAR(100),              -- Unique transaction processing log id
    `initiated_at` TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (`payment_method_id`) REFERENCES `payment_methods` (`id`) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS `refunds` (
    `id` SERIAL PRIMARY KEY,
    `payment_id` INT NOT NULL,
    `gateway_refund_id` VARCHAR(255) UNIQUE,  -- Refund reference from provider
    `amount` DECIMAL(12, 2) NOT NULL,
    `currency` VARCHAR(10) DEFAULT 'USD',
    `reason` TEXT,
    `status` VARCHAR(50) NOT NULL,            -- e.g., PENDING, PROCESSED, FAILED
    `booking_id` INT NOT NULL,                -- Logical connection to Booking Service
    `initiated_by` VARCHAR(100),              -- Administrative or consumer user id tracking
    `processed_by` VARCHAR(100),              -- Automated system or admin tracking ID
    `requested_at` TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    `processed_at` TIMESTAMP WITH TIME ZONE,
    FOREIGN KEY (`payment_id`) REFERENCES `payments` (`id`) ON DELETE RESTRICT
);