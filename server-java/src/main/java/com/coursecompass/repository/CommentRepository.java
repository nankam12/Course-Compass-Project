package com.coursecompass.repository;

import com.coursecompass.model.Comment;
import org.springframework.data.domain.Sort;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface CommentRepository extends MongoRepository<Comment, String> {
    List<Comment> findByCourse(String courseId, Sort sort);
}
