package com.koushik.fomo.fomocalculatorbackend.model.fmp;

import lombok.Data;
import java.util.List;
import com.fasterxml.jackson.annotation.JsonProperty;

@Data
public class FmpHistoricalResponse {
    private String symbol;
    @JsonProperty("historical")
    private List<FmpHistoricalPrice> prices;
}
