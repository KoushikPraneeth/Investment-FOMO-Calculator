package com.koushik.fomo.fomocalculatorbackend.model.fmp;

import lombok.Data;
import com.fasterxml.jackson.annotation.JsonProperty;
import java.time.LocalDate;

@Data
public class FmpHistoricalPrice {
    private String date;
    private double open;
    private double high;
    private double low;
    private double close;
    @JsonProperty("adjClose")
    private double adjustedClose;
    private long volume;
    @JsonProperty("unadjustedVolume")
    private long unadjustedVolume;
    private double change;
    @JsonProperty("changePercent")
    private double changePercent;
    private double vwap;
    private String label;
    @JsonProperty("changeOverTime")
    private double changeOverTime;
}
