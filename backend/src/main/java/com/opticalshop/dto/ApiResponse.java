package com.opticalshop.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class ApiResponse<T> {
    @JsonProperty("unique_id")
    private String uniqueId;

    @JsonProperty("data")
    private List<T> data;

    @JsonProperty("pagination")
    private Pagination pagination;

    @JsonProperty("aggregate_fields")
    private List<AggregateFieldResult> aggregateFields;

    @JsonProperty("status")
    private StatusInfo status;
}
