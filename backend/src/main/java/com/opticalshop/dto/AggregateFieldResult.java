package com.opticalshop.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AggregateFieldResult {
    @JsonProperty("field_name")
    private String fieldName;

    @JsonProperty("operation")
    private String operation;

    @JsonProperty("result")
    private String result;
}
