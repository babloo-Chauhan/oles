package com.oles.oles.controller;

import com.oles.oles.model.*;
import com.oles.oles.repo.*;
import org.springframework.web.bind.annotation.*;
import java.util.*;

@RestController
@RequestMapping("/api/admin/exams")
@CrossOrigin
public class ExamController {
    private final ExamRepository exams;
    private final QuestionRepository questions;

    public ExamController(ExamRepository e, QuestionRepository q) {
        exams = e;
        questions = q;
    }

    @PostMapping
    public Exam create(@RequestBody Exam e) {
        return exams.save(e);
    }

    @GetMapping
    public List<Exam> all() {
        return exams.findAll();
    }

    @PostMapping("/{id}/addQuestion/{qid}")
    public Exam addQuestion(@PathVariable Long id, @PathVariable Long qid) {
        Exam e = exams.findById(id).orElseThrow();
        Question q = questions.findById(qid).orElseThrow();
        e.getQuestions().add(q);
        return exams.save(e);
    }
}