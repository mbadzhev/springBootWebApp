-- Create database
CREATE DATABASE D_SAMPLE;
use D_SAMPLE;

-- Create T_PEOPLE table
CREATE TABLE T_PEOPLE(
    ID INT(10) NOT NULL AUTO_INCREMENT PRIMARY KEY,
    FULL_NAME VARCHAR(90) NOT NULL,
    PIN VARCHAR(10),
    CONSTRAINT chk_PIN CHECK (PIN IS NULL OR (LENGTH(PIN) = 10 AND PIN REGEXP '^[0-9]+$')),
    CONSTRAINT chk_FULL_NAME CHECK (FULL_NAME REGEXP '^[a-zA-Zа-яА-Я -]+$')
);

-- Create T_MAILS table
CREATE TABLE T_MAILS(
    ID INT(10) NOT NULL AUTO_INCREMENT PRIMARY KEY,
    T_PEOPLE_ID INT(10) NOT NULL,
    EMAIL_TYPE VARCHAR(5) NOT NULL,
    EMAIL VARCHAR(40),
    CONSTRAINT fk_T_MAILS_T_PEOPLE FOREIGN KEY (T_PEOPLE_ID) REFERENCES T_PEOPLE(ID),
    CONSTRAINT chk_EMAIL_TYPE CHECK (EMAIL_TYPE REGEXP '^[a-zA-Z0-9]+$'),
    CONSTRAINT chk_EMAIL CHECK (EMAIL IS NULL OR EMAIL REGEXP '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$')
);

-- Create T_ADDRESSES table
CREATE TABLE T_ADDRESSES(
    ID INT(10) NOT NULL AUTO_INCREMENT PRIMARY KEY,
    T_PEOPLE_ID INT(10) NOT NULL,
    ADDR_TYPE VARCHAR(5) NOT NULL,
    ADDR_INFO VARCHAR(300),
    CONSTRAINT fk_T_ADDRESSES_T_PEOPLE FOREIGN KEY (T_PEOPLE_ID) REFERENCES T_PEOPLE(ID),
    CONSTRAINT chk_ADDR_TYPE CHECK (ADDR_TYPE REGEXP '^[a-zA-Z0-9]+$')
);

-- Insert sample data
INSERT INTO T_PEOPLE (FULL_NAME, PIN) VALUES
    ('John Doe', '1234567890'),
    ('Jane Smith', '3276543274'),
    ('Michael Johnson', '9876543210'),
    ('Emily Brown', NULL),
    ('William Davis', '5432167890'),
    ('Olivia Wilson', NULL),
    ('James Taylor', '9876543210'),
    ('Sophia Anderson', NULL),
    ('Liam Martinez', '1234509876'),
    ('Ava Harris', NULL);

INSERT INTO T_MAILS (T_PEOPLE_ID, EMAIL_TYPE, EMAIL) VALUES
    (1, 'Work', 'john@example.com'),
    (1, 'Home', 'john.doe@gmail.com'),
    (2, 'Home', 'jane.smith@example.com'),
    (3, 'Work', 'michael@example.com'),
    (4, 'Home', 'emily@example.com'),
    (5, 'Home', 'william@example.com'),
    (6, 'Work', 'olivia@example.com'),
    (7, 'Home', 'james@example.com'),
    (8, 'Home', 'sophia@example.com'),
    (9, 'Work', 'liam@example.com');

INSERT INTO T_ADDRESSES (T_PEOPLE_ID, ADDR_TYPE, ADDR_INFO) VALUES
    (1, 'Home', '123 Main St, City'),
    (2, 'Home', '456 Elm St, Town'),
    (3, 'Work', '789 Oak St, Metro'),
    (4, 'Home', '987 Maple St, Suburb'),
    (5, 'Home', '543 Pine St, Village'),
    (6, 'Work', '876 Birch St, Urban'),
    (7, 'Home', '765 Cedar St, Countryside'),
    (8, 'Home', '432 Walnut St, Outskirts'),
    (9, 'Work', '109 Pine St, Industrial'),
    (10, 'Home', '210 Oak St, Riverside');
