package com.oles.oles.controller;

import com.oles.oles.model.Question;
import com.oles.oles.repo.QuestionRepository;
import org.springframework.web.bind.annotation.*;
import java.util.*;

@RestController
@RequestMapping("/api/admin/questions")
@CrossOrigin
public class QuestionController {
    private final QuestionRepository repo;

    public QuestionController(QuestionRepository r) {
        repo = r;
    }

    @PostMapping
    public Question create(@RequestBody Question q) {
        return repo.save(q);
    }

    @GetMapping
    public List<Question> all() {
        return repo.findAll();
    }

    @PutMapping("/{id}")
    public Question update(@PathVariable Long id, @RequestBody Question q) {
        q.setId(id);
        return repo.save(q);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        repo.deleteById(id);
    }
}