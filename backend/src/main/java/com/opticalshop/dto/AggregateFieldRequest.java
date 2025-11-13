package com.opticalshop.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AggregateFieldRequest {
    @JsonProperty("field_name")
    private String fieldName;

    @JsonProperty("operation")
    private String operation; // e.g. sum, avg

    @JsonProperty("result")
    private String result;
}
