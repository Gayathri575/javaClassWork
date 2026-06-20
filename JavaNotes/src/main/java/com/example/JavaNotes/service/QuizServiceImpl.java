package com.example.JavaNotes.service;

import com.example.JavaNotes.model.Quiz;
import com.example.JavaNotes.repository.QuizRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class QuizServiceImpl implements QuizService {

    private final QuizRepository quizRepository;

    public QuizServiceImpl(QuizRepository quizRepository) {
        this.quizRepository = quizRepository;
    }

    @Override
    public List<Quiz> getRandomQuiz(String topic) {
        return quizRepository.findRandomByTopic(topic);
    }

    @Override
    public String checkCloudConnection() {
        long count = quizRepository.count();
        return "Connected! Total rows: " + count;
    }
}