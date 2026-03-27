package com.example.JavaNotes.model;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;

@Entity
@Table(name = "quiz_questions") // make sure your MySQL table name matches
public class Quiz {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String topic;
    @Column(name = "sub_topic")
    @JsonProperty("sub_topic") // Core Java, DSA, MySQL, etc.
    private String subTopic;    // Lambda, Exception Handling, Joins, etc.

    @Column(columnDefinition = "TEXT")
    private String question;

    private String option1;
    private String option2;
    private String option3;
    private String option4;

    private String answer;

    @Column(columnDefinition = "TEXT")
    private String explanation;

    // ✅ Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getTopic() { return topic; }
    public void setTopic(String topic) { this.topic = topic; }

    public String getSubTopic() { return subTopic; }
    public void setSubTopic(String subTopic) { this.subTopic = subTopic; }

    public String getQuestion() { return question; }
    public void setQuestion(String question) { this.question = question; }

    public String getOption1() { return option1; }
    public void setOption1(String option1) { this.option1 = option1; }

    public String getOption2() { return option2; }
    public void setOption2(String option2) { this.option2 = option2; }

    public String getOption3() { return option3; }
    public void setOption3(String option3) { this.option3 = option3; }

    public String getOption4() { return option4; }
    public void setOption4(String option4) { this.option4 = option4; }

    public String getAnswer() { return answer; }
    public void setAnswer(String answer) { this.answer = answer; }

    public String getExplanation() { return explanation; }
    public void setExplanation(String explanation) { this.explanation = explanation; }
    // Add this inside your Quiz class
    @JsonProperty("options")
    public String[] getOptionsArray() {
        return new String[]{option1, option2, option3, option4};
    }
}