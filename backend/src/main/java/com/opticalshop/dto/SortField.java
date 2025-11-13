package com.opticalshop.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import com.fasterxml.jackson.annotation.JsonProperty;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SortField {
    @JsonProperty("field")
    private String field;

    @JsonProperty("order")
    private String order; // e.g. "asc" or "desc"
}
