package com.oles.oles.controller;

import com.oles.oles.model.Exam;
import com.oles.oles.model.Question;
import com.oles.oles.model.Result;
import com.oles.oles.repo.ExamRepository;
import com.oles.oles.repo.ResultRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/candidate/exams")
@CrossOrigin
public class CandidateExamController {

    private final ExamRepository exams;
    private final ResultRepository results;

    public CandidateExamController(ExamRepository exams, ResultRepository results) {
        this.exams = exams;
        this.results = results;
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

    // 🔹 Candidate: Submit answers
    @PostMapping("/{id}/submit")
    public Result submit(@PathVariable Long id, @RequestBody Map<Long, Integer> answers) {
        Exam exam = exams.findById(id).orElseThrow();

        int score = 0;
        for (Question q : exam.getQuestions()) {
            Integer ans = answers.get(q.getId());
            if (ans != null && ans.equals(q.getCorrectIndex())) {
                score++;
            }
        }

        Result result = new Result();
        result.setExam(exam);
        result.setScore(score);
        result.setTotal(exam.getQuestions().size());
       
        results.save(result);

        return result;
    }
}
