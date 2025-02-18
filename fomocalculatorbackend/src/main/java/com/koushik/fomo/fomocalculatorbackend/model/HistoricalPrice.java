package com.koushik.fomo.fomocalculatorbackend.model;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;
import java.time.LocalDate;

@Data
public class HistoricalPrice {
    private LocalDate date;
    private double open;
    private double high;
    private double low;
    private double close;
    private long volume;

    @JsonProperty("adjClose")
    private double adjustedClose;
}
