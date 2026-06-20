package com.example.JavaNotes.controller;

import com.example.JavaNotes.model.Quiz;
import com.example.JavaNotes.service.QuizService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/quiz")
public class QuizController {

    private final QuizService quizService;

    public QuizController(QuizService quizService) {
        this.quizService = quizService;
    }

    @GetMapping("/{topic}")
    public List<Quiz> getRandomQuiz(@PathVariable String topic) {
        return quizService.getRandomQuiz(topic);
    }

    @GetMapping("/check-cloud")
    public String checkCloud() {
        return quizService.checkCloudConnection();
    }
}