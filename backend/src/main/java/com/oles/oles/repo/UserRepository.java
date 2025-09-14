package com.oles.oles.repo;

import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import com.oles.oles.model.User;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByUsername(String username);
}