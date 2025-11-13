package com.opticalshop.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class StatusInfo {
    @JsonProperty("time_stamp")
    private String timeStamp;

    @JsonProperty("status")
    private Integer status;

    @JsonProperty("user_message")
    private String userMessage;

    @JsonProperty("message")
    private String message;
}
