CREATE TABLE students (
    student_id SERIAL PRIMARY KEY,
    index_number VARCHAR(20) NOT NULL UNIQUE,
    name VARCHAR(100),
    group VARCHAR(50),
    email VARCHAR(100),
    date_of_birth DATE,
    -- Add other relevant student details
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


CREATE TABLE attendance (
    attendance_id SERIAL PRIMARY KEY,
    student_id INT NOT NULL,
    attendance_date DATE NOT NULL,
    status VARCHAR(20), -- 'Present', 'Absent', 'Late', etc.
    FOREIGN KEY (student_id) REFERENCES students(student_id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (student_id, attendance_date)
);
