package com.example.JavaNotes.model;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Entity
@Table(name = "quiz_questions")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Quiz {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String topic;

    @Column(name = "sub_topic")
    @JsonProperty("sub_topic")
    private String subTopic;

    @Column(columnDefinition = "TEXT")
    private String question;

    private String option1;
    private String option2;
    private String option3;
    private String option4;

    private String answer;

    @Column(columnDefinition = "TEXT")
    private String explanation;

    @JsonProperty("options")
    public String[] getOptionsArray() {
        return new String[]{option1, option2, option3, option4};
    }
}