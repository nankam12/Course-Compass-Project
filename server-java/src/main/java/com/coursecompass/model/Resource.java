package com.coursecompass.model;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@Data
@Document(collection = "resources")
public class Resource {

    @Id
    @JsonProperty("_id")
    private String id;

    private String course;
    private UserRef submittedBy;
    private String title;
    private String type;
    private String url;
    private String description;
    private List<String> votes = new ArrayList<>();
    private Date createdAt = new Date();
}
