package com.coursecompass.service;

import com.coursecompass.dto.CommentRequest;
import com.coursecompass.model.Comment;
import com.coursecompass.model.User;
import com.coursecompass.model.UserRef;
import com.coursecompass.repository.CommentRepository;
import com.coursecompass.repository.CourseRepository;
import com.coursecompass.repository.UserRepository;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
public class CommentService {

    private final CommentRepository commentRepository;
    private final CourseRepository courseRepository;
    private final UserRepository userRepository;

    public CommentService(CommentRepository commentRepository,
                          CourseRepository courseRepository,
                          UserRepository userRepository) {
        this.commentRepository = commentRepository;
        this.courseRepository = courseRepository;
        this.userRepository = userRepository;
    }

    public List<Comment> getComments(String courseId) {
        if (!courseRepository.existsById(courseId)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Course not found");
        }
        return commentRepository.findByCourse(courseId, Sort.by(Sort.Direction.DESC, "createdAt"));
    }

    public Comment addComment(String courseId, CommentRequest req, String userId) {
        if (!courseRepository.existsById(courseId)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Course not found");
        }

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "User not found"));

        Comment comment = new Comment();
        comment.setCourse(courseId);
        comment.setAuthor(new UserRef(user.getId(), user.getUsername()));
        comment.setContent(req.getContent().trim());

        return commentRepository.save(comment);
    }

    public void deleteComment(String commentId, String userId, String userRole) {
        Comment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Comment not found"));

        boolean isAuthor = comment.getAuthor() != null
                && userId.equals(comment.getAuthor().getId());
        boolean isAdmin = "admin".equalsIgnoreCase(userRole);

        if (!isAuthor && !isAdmin) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN,
                    "Not authorized to delete this comment");
        }

        commentRepository.delete(comment);
    }
}
