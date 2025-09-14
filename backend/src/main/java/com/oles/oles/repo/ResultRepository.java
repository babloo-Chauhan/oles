package com.oles.oles.repo;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import com.oles.oles.model.Result;
import com.oles.oles.model.User;

public interface ResultRepository extends JpaRepository<Result, Long> {
    List<Result> findByCandidate(User user);
}