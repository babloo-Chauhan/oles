package com.oles.oles.controller;

import com.oles.oles.model.Exam;
import com.oles.oles.repo.ExamRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/candidate/exams")
@CrossOrigin
public class CandidateExamController {

    private final ExamRepository exams;

    public CandidateExamController(ExamRepository exams) {
        this.exams = exams;
    }

    // 🔹 Candidate: See all exams
    @GetMapping
    public List<Exam> all() {
        return exams.findAll();
    }

    // 🔹 Candidate: Get exam by ID (with questions)
    @GetMapping("/{id}")
    public Exam one(@PathVariable Long id) {
        return exams.findById(id).orElseThrow();
    }
}
