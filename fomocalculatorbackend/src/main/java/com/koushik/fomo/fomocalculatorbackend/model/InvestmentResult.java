package com.koushik.fomo.fomocalculatorbackend.model;

import lombok.Data;
import lombok.Builder;

@Data
@Builder
public class InvestmentResult {
    private String assetName;
    private double entryPrice;
    private double exitPrice;
    private double profitLoss;
    private double profitLossPercentage;
    private double investmentAmount;
    
    // Pain Scale Metrics
    private int pizzaCount;
    private int vacationCount;
    private double retirementYears;
}
