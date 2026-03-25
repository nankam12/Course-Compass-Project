package com.coursecompass.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

import java.util.List;

@Data
public class CourseRequest {

    @NotBlank(message = "Course code is required")
    private String code;

    @NotBlank(message = "Course name is required")
    private String name;

    @NotBlank(message = "Department is required")
    private String department;

    private String description;
    private ProfessorDto professor;
    private List<TaDto> teachingAssistants;
    private String semester;
    private Integer credits;

    @Data
    public static class ProfessorDto {
        private String name;
        private String email;
        private String officeHours;
        private String officeLocation;
    }

    @Data
    public static class TaDto {
        private String name;
        private String email;
        private String officeHours;
    }
}
