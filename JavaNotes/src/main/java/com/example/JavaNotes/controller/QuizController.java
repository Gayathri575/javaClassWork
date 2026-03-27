package com.example.JavaNotes.controller;

import com.example.JavaNotes.model.Quiz;
import com.example.JavaNotes.repository.QuizRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api/quiz")
public class QuizController {

    @Autowired
    private QuizRepository quizRepository;

    @GetMapping("/{topic}")
    public List<Quiz> getRandomQuiz(@PathVariable String topic) {
        // 1. See what the browser sent
        System.out.println("DEBUG: Incoming topic from URL: [" + topic + "]");

        List<Quiz> results = quizRepository.findRandomByTopic(topic);

        // 2. See what the DB found
        System.out.println("DEBUG: Questions found in Database: " + results.size());

        return results;
    }
    @GetMapping("/check-cloud")
    public String checkCloud() {
        try {
            long count = quizRepository.count();
            return "Connected to Aiven! Total rows found: " + count;
        } catch (Exception e) {
            return "Connection Error: " + e.getMessage();
        }
    }
}