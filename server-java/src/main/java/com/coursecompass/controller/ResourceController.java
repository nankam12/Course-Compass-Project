package com.coursecompass.controller;

import com.coursecompass.dto.ResourceRequest;
import com.coursecompass.model.Resource;
import com.coursecompass.model.User;
import com.coursecompass.repository.UserRepository;
import com.coursecompass.service.ResourceService;
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
public class ResourceController {

    private final ResourceService resourceService;
    private final UserRepository userRepository;

    public ResourceController(ResourceService resourceService, UserRepository userRepository) {
        this.resourceService = resourceService;
        this.userRepository = userRepository;
    }

    @GetMapping("/courses/{courseId}/resources")
    public ResponseEntity<Map<String, List<Resource>>> getResources(@PathVariable String courseId) {
        return ResponseEntity.ok(Map.of("resources", resourceService.getResources(courseId)));
    }

    @PostMapping("/courses/{courseId}/resources")
    public ResponseEntity<Map<String, Resource>> addResource(
            @PathVariable String courseId,
            @Valid @RequestBody ResourceRequest req,
            @AuthenticationPrincipal UserDetails userDetails) {
        String userId = userDetails.getUsername();
        Resource resource = resourceService.addResource(courseId, req, userId);
        return ResponseEntity.status(HttpStatus.CREATED).body(Map.of("resource", resource));
    }

    @PostMapping("/resources/{id}/vote")
    public ResponseEntity<Map<String, Object>> voteResource(
            @PathVariable String id,
            @AuthenticationPrincipal UserDetails userDetails) {
        String userId = userDetails.getUsername();
        return ResponseEntity.ok(resourceService.voteResource(id, userId));
    }

    @DeleteMapping("/resources/{id}")
    public ResponseEntity<Map<String, String>> deleteResource(
            @PathVariable String id,
            @AuthenticationPrincipal UserDetails userDetails) {
        String userId = userDetails.getUsername();
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "User not found"));
        resourceService.deleteResource(id, userId, user.getRole());
        return ResponseEntity.ok(Map.of("message", "Resource deleted successfully"));
    }
}
