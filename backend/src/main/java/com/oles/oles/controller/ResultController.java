package com.oles.oles.controller;

import com.oles.oles.model.*;
import com.oles.oles.repo.*;
import org.springframework.web.bind.annotation.*;
import java.util.*;

@RestController
@RequestMapping("/api")
@CrossOrigin
public class ResultController {
    private final ExamRepository exams;
    private final ResultRepository results;
    private final UserRepository users;

    public ResultController(ExamRepository e, ResultRepository r, UserRepository u) {
        exams = e;
        results = r;
        users = u;
    }

    @PostMapping("/candidate/exams/{id}/submit")
    public Result submit(@PathVariable Long id, @RequestBody Map<Long, Integer> answers,
            @RequestHeader("X-User") String username) {
        Exam exam = exams.findById(id).orElseThrow();
        User user = users.findByUsername(username).orElseThrow();
        int total = exam.getQuestions().size();
        int score = 0;
        for (Question q : exam.getQuestions()) {
            Integer chosen = answers.get(q.getId());
            if (chosen != null && chosen.equals(q.getCorrectIndex()))
                score++;
        }
        Result res = new Result(user, exam, score, total);
        return results.save(res);
    }

    @GetMapping("/candidate/results")
    public List<Result> myResults(@RequestHeader("X-User") String username) {
        User user = users.findByUsername(username).orElseThrow();
        return results.findByCandidate(user);
    }
}