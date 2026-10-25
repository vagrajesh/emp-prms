-- Schema for Employee Performance Review Management System (PostgreSQL)

-- Drop in dependency order (safe to re-run)
DROP TABLE IF EXISTS performance_reviews;
DROP TABLE IF EXISTS review_periods;
DROP TABLE IF EXISTS employees;

CREATE TABLE IF NOT EXISTS employees (
    id          SERIAL PRIMARY KEY,
    employee_id VARCHAR(20)  NOT NULL UNIQUE,
    name        VARCHAR(100) NOT NULL,
    department  VARCHAR(100),
    email       VARCHAR(100),
    status      VARCHAR(20)  DEFAULT 'Active'
);

CREATE TABLE IF NOT EXISTS review_periods (
    id         SERIAL PRIMARY KEY,
    name       VARCHAR(50) NOT NULL UNIQUE,
    start_date DATE        NOT NULL,
    end_date   DATE        NOT NULL,
    status     VARCHAR(20) DEFAULT 'Open' CHECK (status IN ('Open', 'Closed'))
);

CREATE TABLE IF NOT EXISTS performance_reviews (
    id               SERIAL PRIMARY KEY,
    employee_id      INTEGER       NOT NULL REFERENCES employees(id),
    period_id        INTEGER       NOT NULL REFERENCES review_periods(id),
    quality_rating   INTEGER       NOT NULL CHECK (quality_rating BETWEEN 1 AND 5),
    delivery_rating  INTEGER       NOT NULL CHECK (delivery_rating BETWEEN 1 AND 5),
    teamwork_rating  INTEGER       NOT NULL CHECK (teamwork_rating BETWEEN 1 AND 5),
    average_rating   DECIMAL(3,2)  NOT NULL,
    comments         TEXT          NOT NULL,
    created_at       TIMESTAMP     DEFAULT NOW(),
    UNIQUE (employee_id, period_id)
);
