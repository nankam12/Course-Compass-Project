package com.coursecompass.service;

import com.coursecompass.dto.CourseRequest;
import com.coursecompass.model.Course;
import com.coursecompass.repository.CourseRepository;
import org.springframework.data.domain.Sort;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Map;

@Service
public class CourseService {

    private final CourseRepository courseRepository;
    private final MongoTemplate mongoTemplate;

    public CourseService(CourseRepository courseRepository, MongoTemplate mongoTemplate) {
        this.courseRepository = courseRepository;
        this.mongoTemplate = mongoTemplate;
    }

    public Map<String, Object> getCourses(String search, String department, int page, int limit) {
        int safePage = Math.max(1, page);
        int safeLimit = Math.min(50, Math.max(1, limit));
        int skip = (safePage - 1) * safeLimit;

        Query query = new Query();

        if (search != null && !search.isBlank()) {
            String escaped = escapeRegex(search.trim());
            Criteria searchCriteria = new Criteria().orOperator(
                    Criteria.where("name").regex(escaped, "i"),
                    Criteria.where("code").regex(escaped, "i"),
                    Criteria.where("department").regex(escaped, "i"),
                    Criteria.where("description").regex(escaped, "i")
            );
            query.addCriteria(searchCriteria);
        }

        if (department != null && !department.isBlank()) {
            String escaped = escapeRegex(department.trim());
            query.addCriteria(Criteria.where("department").regex("^" + escaped + "$", "i"));
        }

        query.with(Sort.by(Sort.Direction.ASC, "code"));

        long total = mongoTemplate.count(query, Course.class);
        query.skip(skip).limit(safeLimit);
        List<Course> courses = mongoTemplate.find(query, Course.class);

        int pages = (int) Math.ceil((double) total / safeLimit);
        return Map.of("courses", courses, "total", total, "page", safePage, "pages", pages);
    }

    public Course getCourseById(String id) {
        return courseRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Course not found"));
    }

    public Course createCourse(CourseRequest req) {
        if (courseRepository.existsByCodeIgnoreCase(req.getCode())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    "A course with this code already exists");
        }
        return courseRepository.save(mapToCourse(req));
    }

    public List<String> getDepartments() {
        List<String> departments = mongoTemplate.findDistinct("department", Course.class, String.class);
        departments.sort(String::compareTo);
        return departments;
    }

    private Course mapToCourse(CourseRequest req) {
        Course course = new Course();
        course.setCode(req.getCode().trim().toUpperCase());
        course.setName(req.getName().trim());
        course.setDepartment(req.getDepartment().trim());
        if (req.getDescription() != null) course.setDescription(req.getDescription().trim());
        if (req.getSemester() != null) course.setSemester(req.getSemester().trim());
        if (req.getCredits() != null) course.setCredits(req.getCredits());

        if (req.getProfessor() != null) {
            Course.Professor prof = new Course.Professor();
            prof.setName(req.getProfessor().getName());
            prof.setEmail(req.getProfessor().getEmail());
            prof.setOfficeHours(req.getProfessor().getOfficeHours());
            prof.setOfficeLocation(req.getProfessor().getOfficeLocation());
            course.setProfessor(prof);
        }

        if (req.getTeachingAssistants() != null) {
            List<Course.TeachingAssistant> tas = req.getTeachingAssistants().stream().map(dto -> {
                Course.TeachingAssistant ta = new Course.TeachingAssistant();
                ta.setName(dto.getName());
                ta.setEmail(dto.getEmail());
                ta.setOfficeHours(dto.getOfficeHours());
                return ta;
            }).toList();
            course.setTeachingAssistants(tas);
        }

        return course;
    }

    /** Escapes MongoDB regex special characters to prevent ReDoS attacks. */
    private String escapeRegex(String input) {
        return input.replaceAll("([\\^$.*+?()\\[\\]{}|\\\\])", "\\\\$1");
    }
}
