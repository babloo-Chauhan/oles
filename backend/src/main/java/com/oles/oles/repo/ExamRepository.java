package com.oles.oles.repo;
import org.springframework.data.jpa.repository.JpaRepository;
import com.oles.oles.model.Exam;
public interface ExamRepository extends JpaRepository<Exam, Long> {}