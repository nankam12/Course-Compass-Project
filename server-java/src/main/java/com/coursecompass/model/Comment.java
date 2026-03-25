package com.coursecompass.model;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.Date;

@Data
@Document(collection = "comments")
public class Comment {

    @Id
    @JsonProperty("_id")
    private String id;

    private String course;
    private UserRef author;
    private String content;
    private Date createdAt = new Date();
}
