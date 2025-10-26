package com.oles.oles.service;

import com.oles.oles.model.*;
import com.oles.oles.repo.ExamRepository;
import com.oles.oles.repo.QuestionRepository;
import com.oles.oles.repo.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class DataInitializationService implements CommandLineRunner {

    @Autowired
    private ExamRepository examRepository;

    @Autowired
    private QuestionRepository questionRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    @Transactional
    public void run(String... args) throws Exception {
        // Create sample data if database is empty
        if (userRepository.count() == 0) {
            createSampleUsers();
        }
        if (questionRepository.count() == 0) {
            createSampleQuestions();
        }
        if (examRepository.count() == 0) {
            createSampleExams();
        }
        
        // Attach questions to exams based on subject
        attachQuestionsToExams();
    }

    private void createSampleUsers() {
        User admin = new User();
        admin.setUsername("admin");
        admin.setPassword(passwordEncoder.encode("Admin@123"));
        admin.setName("Admin");
        admin.setEmail("admin@oles.com");
        admin.setRole(Role.ADMIN);
        userRepository.save(admin);

        User student = new User();
        student.setUsername("student");
        student.setPassword(passwordEncoder.encode("Admin@123"));
        student.setName("Student");
        student.setEmail("student@oles.com");
        student.setRole(Role.CANDIDATE);
        userRepository.save(student);

        System.out.println("Created sample users");
    }

    private void createSampleQuestions() {
        // Mathematics questions
        Question q1 = new Question("Mathematics", "What is 2 + 2?", "3", "4", "5", "6", 2);
        Question q2 = new Question("Mathematics", "What is the square root of 16?", "2", "4", "6", "8", 2);
        
        // Science questions
        Question q3 = new Question("Science", "What is the chemical symbol for water?", "H2O", "CO2", "O2", "H2", 1);
        Question q4 = new Question("Science", "What planet is known as the Red Planet?", "Venus", "Mars", "Jupiter", "Saturn", 2);
        
        // English questions
        Question q5 = new Question("English", "Which of the following is a noun?", "run", "quickly", "book", "beautifully", 3);
        Question q6 = new Question("English", "What is the plural of 'child'?", "childs", "children", "childes", "child", 2);

        questionRepository.save(q1);
        questionRepository.save(q2);
        questionRepository.save(q3);
        questionRepository.save(q4);
        questionRepository.save(q5);
        questionRepository.save(q6);

        System.out.println("Created sample questions");
    }

    private void createSampleExams() {
        Exam mathExam = new Exam("Math Basics", "Mathematics", 30, 
            LocalDateTime.of(2024, 1, 1, 9, 0), 
            LocalDateTime.of(2024, 12, 31, 23, 59));
        
        Exam scienceExam = new Exam("Science Fundamentals", "Science", 45,
            LocalDateTime.of(2024, 1, 1, 9, 0),
            LocalDateTime.of(2024, 12, 31, 23, 59));
        
        Exam englishExam = new Exam("English Grammar", "English", 25,
            LocalDateTime.of(2024, 1, 1, 9, 0),
            LocalDateTime.of(2024, 12, 31, 23, 59));

        examRepository.save(mathExam);
        examRepository.save(scienceExam);
        examRepository.save(englishExam);

        System.out.println("Created sample exams");
    }

    private void attachQuestionsToExams() {
        List<Exam> exams = examRepository.findAll();
        List<Question> questions = questionRepository.findAll();

        for (Exam exam : exams) {
            // Clear existing questions first
            exam.getQuestions().clear();
            
            // Add questions that match the exam subject
            for (Question question : questions) {
                if (question.getSubject().equals(exam.getSubject())) {
                    exam.getQuestions().add(question);
                }
            }
            
            // Save the exam with attached questions
            if (!exam.getQuestions().isEmpty()) {
                examRepository.save(exam);
                System.out.println("Attached " + exam.getQuestions().size() + " questions to exam: " + exam.getTitle());
            }
        }
    }
}
