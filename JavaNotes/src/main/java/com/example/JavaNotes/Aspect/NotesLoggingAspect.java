package com.example.JavaNotes.Aspect;

import org.aspectj.lang.JoinPoint;
import org.aspectj.lang.annotation.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

@Aspect
@Component
public class NotesLoggingAspect {

    private static final Logger logger =
            LoggerFactory.getLogger(NotesLoggingAspect.class);

    @Before("execution(* com.example.JavaNotes.service.NotesServiceImpl.*(..))")
    public void logBefore(JoinPoint jp) {
        logger.info("Method Started: {}", jp.getSignature().getName());
    }

    @After("execution(* com.example.JavaNotes.service.NotesServiceImpl.*(..))")
    public void logAfter(JoinPoint jp) {
        logger.info("Method Completed: {}", jp.getSignature().getName());
    }

    @AfterReturning(
            pointcut = "execution(* com.example.JavaNotes.service.NotesServiceImpl.*(..))",
            returning = "result"
    )
    public void logReturns(JoinPoint jp, Object result) {
        logger.info("Method {} returned: {}",
                jp.getSignature().getName(), result);
    }

    @AfterThrowing(
            pointcut = "execution(* com.example.JavaNotes.service.NotesServiceImpl.*(..))",
            throwing = "ex"
    )
    public void logException(JoinPoint jp, Exception ex) {
        logger.error("Exception in method {}: {}",
                jp.getSignature().getName(), ex.getMessage());
    }
}