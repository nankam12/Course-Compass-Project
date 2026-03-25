package com.coursecompass.service;

import com.coursecompass.dto.ResourceRequest;
import com.coursecompass.model.Resource;
import com.coursecompass.model.User;
import com.coursecompass.model.UserRef;
import com.coursecompass.repository.CourseRepository;
import com.coursecompass.repository.ResourceRepository;
import com.coursecompass.repository.UserRepository;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Map;

@Service
public class ResourceService {

    private final ResourceRepository resourceRepository;
    private final CourseRepository courseRepository;
    private final UserRepository userRepository;

    public ResourceService(ResourceRepository resourceRepository,
                           CourseRepository courseRepository,
                           UserRepository userRepository) {
        this.resourceRepository = resourceRepository;
        this.courseRepository = courseRepository;
        this.userRepository = userRepository;
    }

    public List<Resource> getResources(String courseId) {
        if (!courseRepository.existsById(courseId)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Course not found");
        }
        List<Resource> resources = resourceRepository.findByCourse(courseId,
                Sort.by(Sort.Direction.DESC, "createdAt"));
        resources.sort((a, b) -> b.getVotes().size() - a.getVotes().size());
        return resources;
    }

    public Resource addResource(String courseId, ResourceRequest req, String userId) {
        if (!courseRepository.existsById(courseId)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Course not found");
        }

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "User not found"));

        Resource resource = new Resource();
        resource.setCourse(courseId);
        resource.setSubmittedBy(new UserRef(user.getId(), user.getUsername()));
        resource.setTitle(req.getTitle().trim());
        resource.setType(req.getType());
        if (req.getUrl() != null && !req.getUrl().isBlank()) {
            resource.setUrl(req.getUrl().trim());
        }
        if (req.getDescription() != null && !req.getDescription().isBlank()) {
            resource.setDescription(req.getDescription().trim());
        }

        return resourceRepository.save(resource);
    }

    public Map<String, Object> voteResource(String resourceId, String userId) {
        Resource resource = resourceRepository.findById(resourceId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Resource not found"));

        boolean hasVoted = resource.getVotes().contains(userId);
        if (hasVoted) {
            resource.getVotes().remove(userId);
        } else {
            resource.getVotes().add(userId);
        }
        resourceRepository.save(resource);

        return Map.of("voteCount", resource.getVotes().size(), "hasVoted", !hasVoted);
    }

    public void deleteResource(String resourceId, String userId, String userRole) {
        Resource resource = resourceRepository.findById(resourceId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Resource not found"));

        boolean isOwner = resource.getSubmittedBy() != null
                && userId.equals(resource.getSubmittedBy().getId());
        boolean isAdmin = "admin".equalsIgnoreCase(userRole);

        if (!isOwner && !isAdmin) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN,
                    "Not authorized to delete this resource");
        }

        resourceRepository.delete(resource);
    }
}
