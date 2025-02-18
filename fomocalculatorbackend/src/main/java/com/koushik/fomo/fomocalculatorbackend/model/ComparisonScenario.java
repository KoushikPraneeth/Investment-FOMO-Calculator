package com.koushik.fomo.fomocalculatorbackend.model;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class ComparisonScenario {
    private String id;
    private String label;
    private String asset1Symbol;
    private String asset2Symbol;
    private String asset1Name;
    private String asset2Name;
    private String description;
}
