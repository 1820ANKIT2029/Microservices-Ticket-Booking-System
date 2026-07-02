DO $$ BEGIN
    CREATE TYPE payment_gateway AS ENUM ('PAYPAL', 'RAZORPAY', 'STRIPE');
    CREATE TYPE payment_status AS ENUM ('FAILED', 'INITIATED', 'REFUNDED', 'SUCCESS');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

CREATE TABLE IF NOT EXISTS `payments` (
    `id` SERIAL PRIMARY KEY,
    `gateway_name` payment_gateway NOT NULL,     -- e.g., STRIPE, PAYPAL
    `gateway_payment_id` VARCHAR(255) UNIQUE, -- Transaction reference from provider
    `gateway_order_id` VARCHAR(255) UNIQUE,          -- Associated order record on provider
    `amount` DECIMAL(12, 2) NOT NULL,
    `currency` VARCHAR(10) DEFAULT 'INR',
    `status` payment_status NOT NULL,            -- e.g., INITIATED, SUCCESS, FAILED
    `method` VARCHAR(50),                     -- Quick copy reference of the processing type
    `gateway_response` TEXT,                  -- Complete payload logging for debugging
    `booking_id` INT NOT NULL,                -- Logical connection to Booking Service
    `user_id` VARCHAR(100) NOT NULL,          -- Logical connection to User Service
    `completed_id` VARCHAR(100) UNIQUE,              -- Unique transaction processing log id
    `initiated_at` TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
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