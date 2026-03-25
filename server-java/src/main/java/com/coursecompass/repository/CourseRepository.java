package com.coursecompass.repository;

import com.coursecompass.model.Course;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface CourseRepository extends MongoRepository<Course, String> {
    boolean existsByCodeIgnoreCase(String code);
}
