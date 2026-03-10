-- ======================================
-- ParkEase Smart Parking Database
-- ======================================

CREATE DATABASE IF NOT EXISTS parkease;
USE parkease;

-- ======================================
-- USERS TABLE
-- ======================================

CREATE TABLE users (
    user_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    phone VARCHAR(15) UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role ENUM('USER','ADMIN') DEFAULT 'USER',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ======================================
-- PARKING LOCATIONS
-- ======================================

CREATE TABLE parking_locations (
    location_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    address VARCHAR(255) NOT NULL,
    city VARCHAR(100),
    latitude DECIMAL(10,8),
    longitude DECIMAL(11,8),
    total_slots INT NOT NULL,
    available_slots INT NOT NULL,
    price_per_hour DECIMAL(10,2) NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ======================================
-- PARKING SLOTS
-- ======================================

CREATE TABLE parking_slots (
    slot_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    location_id BIGINT NOT NULL,
    slot_number VARCHAR(20) NOT NULL,
    slot_type ENUM('CAR','BIKE','EV','HANDICAP') DEFAULT 'CAR',
    status ENUM('AVAILABLE','OCCUPIED','RESERVED','OUT_OF_SERVICE') DEFAULT 'AVAILABLE',

    CONSTRAINT fk_slot_location
        FOREIGN KEY (location_id)
        REFERENCES parking_locations(location_id)
        ON DELETE CASCADE
);

-- ======================================
-- RESERVATIONS
-- ======================================

CREATE TABLE reservations (
    reservation_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    slot_id BIGINT NOT NULL,
    start_time DATETIME NOT NULL,
    end_time DATETIME NOT NULL,
    total_amount DECIMAL(10,2),

    CONSTRAINT fk_res_user
        FOREIGN KEY (user_id)
        REFERENCES users(user_id)
        ON DELETE CASCADE,

    CONSTRAINT fk_res_slot
        FOREIGN KEY (slot_id)
        REFERENCES parking_slots(slot_id)
        ON DELETE CASCADE
);

-- ======================================
-- PAYMENTS
-- ======================================

CREATE TABLE payments (
    payment_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    reservation_id BIGINT NOT NULL,
    payment_method ENUM('UPI','CARD','NET_BANKING','WALLET','CASH'),
    amount DECIMAL(10,2),
    payment_status ENUM('PENDING','SUCCESS','FAILED','REFUNDED') DEFAULT 'PENDING',
    transaction_id VARCHAR(150),
    payment_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_payment_reservation
        FOREIGN KEY (reservation_id)
        REFERENCES reservations(reservation_id)
        ON DELETE CASCADE
);

-- ======================================
-- REVIEWS
-- ======================================

CREATE TABLE reviews (
    review_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    location_id BIGINT NOT NULL,
    rating INT CHECK (rating BETWEEN 1 AND 5),
    comment TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_review_user
        FOREIGN KEY (user_id)
        REFERENCES users(user_id)
        ON DELETE CASCADE,

    CONSTRAINT fk_review_location
        FOREIGN KEY (location_id)
        REFERENCES parking_locations(location_id)
        ON DELETE CASCADE
);

-- ======================================
-- INDEXES (Performance)
-- ======================================

CREATE INDEX idx_city ON parking_locations(city);
CREATE INDEX idx_slot_status ON parking_slots(status);
CREATE INDEX idx_res_user ON reservations(user_id);
CREATE INDEX idx_payment_status ON payments(payment_status);
