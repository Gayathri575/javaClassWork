package com.example.JavaNotes.repository;

import com.example.JavaNotes.model.Quiz;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface QuizRepository extends JpaRepository<Quiz, Long> {

    @Query(value = "SELECT * FROM quiz_questions WHERE LOWER(REPLACE(topic, ' ', '')) = LOWER(REPLACE(:topic, ' ', '')) ORDER BY RAND() LIMIT 15", nativeQuery = true)
    List<Quiz> findRandomByTopic(@Param("topic") String topic);
}