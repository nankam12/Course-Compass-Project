package com.coursecompass.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class ResourceRequest {

    @NotBlank(message = "Resource title is required")
    @Size(max = 200, message = "Title cannot exceed 200 characters")
    private String title;

    @NotBlank(message = "Resource type is required")
    @Pattern(regexp = "^(video|notes|textbook|website|practice_problems|other)$",
             message = "Invalid resource type")
    private String type;

    @Pattern(regexp = "^(https?://.+)?$",
             message = "URL must start with http:// or https://")
    private String url;

    @Size(max = 500, message = "Description cannot exceed 500 characters")
    private String description;
}
