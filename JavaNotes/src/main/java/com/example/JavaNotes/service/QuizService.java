package com.example.JavaNotes.service;

import com.example.JavaNotes.model.Quiz;

import java.util.List;

public interface QuizService {
    List<Quiz> getRandomQuiz(String topic);
    String checkCloudConnection();
}