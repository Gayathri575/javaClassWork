package com.example.JavaNotes.repository;

import com.example.JavaNotes.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByUsername(String username);

    void deleteByUsername(String name);

    Optional<User> findByEmail(String identifier);
}