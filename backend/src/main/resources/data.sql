INSERT INTO users(username,password,name,email,role) VALUES
('admin', '$2a$10$Q3s3sI3v1o1B3CqL3vRzUuQ7S3yI5o3a6wTg9FZ1j2qkqkqkqkqkq', 'Admin', 'admin@oles.oles.com', 'ADMIN'),
('student', '$2a$10$Q3s3sI3v1o1B3CqL3vRzUuQ7S3yI5o3a6wTg9FZ1j2qkqkqkqkqkq', 'Student', 'student@oles.oles.com', 'CANDIDATE');
-- password here is bcrypt for "Admin@123" (generate your own)

-- Sample Questions
INSERT INTO questions(subject, text, choice1, choice2, choice3, choice4, correct_index) VALUES
('Mathematics', 'What is 2 + 2?', '3', '4', '5', '6', 2),
('Mathematics', 'What is the square root of 16?', '2', '4', '6', '8', 2),
('Science', 'What is the chemical symbol for water?', 'H2O', 'CO2', 'O2', 'H2', 1),
('Science', 'What planet is known as the Red Planet?', 'Venus', 'Mars', 'Jupiter', 'Saturn', 2),
('English', 'Which of the following is a noun?', 'run', 'quickly', 'book', 'beautifully', 3),
('English', 'What is the plural of "child"?', 'childs', 'children', 'childes', 'child', 2);

-- Sample Exams
INSERT INTO exam(title, subject, duration_minutes, start_time, end_time) VALUES
('Math Basics', 'Mathematics', 30, '2024-01-01 09:00:00', '2024-12-31 23:59:59'),
('Science Fundamentals', 'Science', 45, '2024-01-01 09:00:00', '2024-12-31 23:59:59'),
('English Grammar', 'English', 25, '2024-01-01 09:00:00', '2024-12-31 23:59:59');