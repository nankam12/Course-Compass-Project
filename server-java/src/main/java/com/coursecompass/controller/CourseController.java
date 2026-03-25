package com.coursecompass.controller;

import com.coursecompass.dto.CourseRequest;
import com.coursecompass.model.Course;
import com.coursecompass.service.CourseService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.Instant;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
public class CourseController {

    private final CourseService courseService;

    public CourseController(CourseService courseService) {
        this.courseService = courseService;
    }

    @GetMapping("/courses")
    public ResponseEntity<Map<String, Object>> getCourses(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String department,
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "20") int limit) {
        return ResponseEntity.ok(courseService.getCourses(search, department, page, limit));
    }

    @GetMapping("/courses/departments")
    public ResponseEntity<Map<String, List<String>>> getDepartments() {
        return ResponseEntity.ok(Map.of("departments", courseService.getDepartments()));
    }

    @GetMapping("/courses/{id}")
    public ResponseEntity<Map<String, Course>> getCourse(@PathVariable String id) {
        return ResponseEntity.ok(Map.of("course", courseService.getCourseById(id)));
    }

    @PostMapping("/courses")
    public ResponseEntity<Map<String, Course>> createCourse(@Valid @RequestBody CourseRequest req) {
        Course course = courseService.createCourse(req);
        return ResponseEntity.status(HttpStatus.CREATED).body(Map.of("course", course));
    }

    @GetMapping("/health")
    public ResponseEntity<Map<String, String>> health() {
        return ResponseEntity.ok(Map.of("status", "ok", "timestamp", Instant.now().toString()));
    }
}
