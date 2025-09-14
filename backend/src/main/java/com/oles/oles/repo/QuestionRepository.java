package com.oles.oles.repo;

import org.springframework.data.jpa.repository.JpaRepository;
import com.oles.oles.model.Question;

public interface QuestionRepository extends JpaRepository<Question, Long> {
}