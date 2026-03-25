package com.coursecompass.repository;

import com.coursecompass.model.Resource;
import org.springframework.data.domain.Sort;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface ResourceRepository extends MongoRepository<Resource, String> {
    List<Resource> findByCourse(String courseId, Sort sort);
}
