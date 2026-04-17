CREATE DATABASE internship_db;
USE internship_db;

CREATE TABLE user_history (
    id INT AUTO_INCREMENT PRIMARY KEY,
    domain TEXT,
    skills TEXT,
    location VARCHAR(50),
    mode VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

SELECT * FROM user_history;

