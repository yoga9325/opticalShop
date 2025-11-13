package com.opticalshop.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CommonPayload {
    @JsonProperty("pagination")
    private Pagination pagination;

    @JsonProperty("sort")
    private List<SortField> sort;

    @JsonProperty("filters")
    private List<String> filters;

    @JsonProperty("aggregate_fields")
    private List<AggregateFieldRequest> aggregateFields;

    // @JsonProperty("city")
    // private String city;
}
