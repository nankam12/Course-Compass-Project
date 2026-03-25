package com.coursecompass.model;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@Data
@Document(collection = "courses")
public class Course {

    @Id
    @JsonProperty("_id")
    private String id;

    @Indexed(unique = true)
    private String code;

    private String name;
    private String department;
    private String description;
    private Professor professor;
    private List<TeachingAssistant> teachingAssistants = new ArrayList<>();
    private String semester;
    private int credits = 3;
    private Date createdAt = new Date();

    @Data
    public static class Professor {
        private String name;
        private String email;
        private String officeHours;
        private String officeLocation;
    }

    @Data
    public static class TeachingAssistant {
        private String name;
        private String email;
        private String officeHours;
    }
}
