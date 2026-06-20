package com.example.JavaNotes.Aspect;

import org.aspectj.lang.JoinPoint;
import org.aspectj.lang.annotation.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

@Aspect
@Component
public class QuizLoggingAspect {

    private static final Logger logger =
            LoggerFactory.getLogger(QuizLoggingAspect.class);

    @Before("execution(* com.example.JavaNotes.service.QuizServiceImpl.*(..))")
    public void logBefore(JoinPoint jp) {
        logger.info("Quiz Method Started: {}", jp.getSignature().getName());
    }

    @After("execution(* com.example.JavaNotes.service.QuizServiceImpl.*(..))")
    public void logAfter(JoinPoint jp) {
        logger.info("Quiz Method Completed: {}", jp.getSignature().getName());
    }

    @AfterReturning(
            pointcut = "execution(* com.example.JavaNotes.service.QuizServiceImpl.*(..))",
            returning = "result"
    )
    public void logReturn(JoinPoint jp, Object result) {
        logger.info("Quiz Method {} returned: {}",
                jp.getSignature().getName(), result);
    }

    @AfterThrowing(
            pointcut = "execution(* com.example.JavaNotes.service.QuizServiceImpl.*(..))",
            throwing = "ex"
    )
    public void logException(JoinPoint jp, Exception ex) {
        logger.error("Quiz Method {} threw exception: {}",
                jp.getSignature().getName(), ex.getMessage());
    }
}