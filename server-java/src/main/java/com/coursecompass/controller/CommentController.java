package com.coursecompass.controller;

import com.coursecompass.dto.CommentRequest;
import com.coursecompass.model.Comment;
import com.coursecompass.model.User;
import com.coursecompass.repository.UserRepository;
import com.coursecompass.service.CommentService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
public class CommentController {

    private final CommentService commentService;
    private final UserRepository userRepository;

    public CommentController(CommentService commentService, UserRepository userRepository) {
        this.commentService = commentService;
        this.userRepository = userRepository;
    }

    @GetMapping("/courses/{courseId}/comments")
    public ResponseEntity<Map<String, List<Comment>>> getComments(@PathVariable String courseId) {
        return ResponseEntity.ok(Map.of("comments", commentService.getComments(courseId)));
    }

    @PostMapping("/courses/{courseId}/comments")
    public ResponseEntity<Map<String, Comment>> addComment(
            @PathVariable String courseId,
            @Valid @RequestBody CommentRequest req,
            @AuthenticationPrincipal UserDetails userDetails) {
        String userId = userDetails.getUsername();
        Comment comment = commentService.addComment(courseId, req, userId);
        return ResponseEntity.status(HttpStatus.CREATED).body(Map.of("comment", comment));
    }

    @DeleteMapping("/comments/{id}")
    public ResponseEntity<Map<String, String>> deleteComment(
            @PathVariable String id,
            @AuthenticationPrincipal UserDetails userDetails) {
        String userId = userDetails.getUsername();
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "User not found"));
        commentService.deleteComment(id, userId, user.getRole());
        return ResponseEntity.ok(Map.of("message", "Comment deleted successfully"));
    }
}
