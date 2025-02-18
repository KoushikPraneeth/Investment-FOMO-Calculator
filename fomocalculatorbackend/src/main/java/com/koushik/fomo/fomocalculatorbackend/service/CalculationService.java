package com.koushik.fomo.fomocalculatorbackend.service;

import com.koushik.fomo.fomocalculatorbackend.model.InvestmentResult;
import lombok.extern.slf4j.Slf4j;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.time.LocalDate;

@Service
@RequiredArgsConstructor
@Slf4j
public class CalculationService {
    private final FinancialDataService financialDataService;

    @Value("${metrics.pizza.averagePrice}")
    private double averagePizzaPrice;

    @Value("${metrics.vacation.averagePrice}")
    private double averageVacationPrice;

    @Value("${metrics.retirement.monthlyExpense}")
    private double monthlyRetirementExpense;

    public InvestmentResult calculateInvestment(String symbol, LocalDate entryDate, LocalDate exitDate, double investmentAmount) {
        log.info("Calculating investment result for symbol: {}, entry: {}, exit: {}, amount: ${}", 
                symbol, entryDate, exitDate, investmentAmount);
        // Get prices from financial data service
        log.debug("Fetching entry and exit prices from financial data service");
        double entryPrice = financialDataService.getClosestPrice(symbol, entryDate);
        double exitPrice = financialDataService.getClosestPrice(symbol, exitDate);
        log.debug("Retrieved prices - Entry: ${}, Exit: ${}", entryPrice, exitPrice);

        // Calculate number of shares (assuming fractional shares are possible)
        double shares = investmentAmount / entryPrice;

        // Calculate profit/loss
        double finalValue = shares * exitPrice;
        double profitLoss = finalValue - investmentAmount;
        double profitLossPercentage = (profitLoss / investmentAmount) * 100;

        // Calculate pain scale metrics
        int pizzaCount = calculatePizzaCount(profitLoss);
        int vacationCount = calculateVacationCount(profitLoss);
        double retirementYears = calculateRetirementYears(profitLoss);

        log.info("Investment calculation completed - Profit/Loss: ${}, Percentage: {}%, Pizza Count: {}, Vacation Count: {}, Retirement Years: {}", 
                profitLoss, profitLossPercentage, pizzaCount, vacationCount, retirementYears);

        // Build and return result
        return InvestmentResult.builder()
                .assetName(symbol)
                .entryPrice(entryPrice)
                .exitPrice(exitPrice)
                .profitLoss(profitLoss)
                .profitLossPercentage(profitLossPercentage)
                .investmentAmount(investmentAmount)
                .pizzaCount(pizzaCount)
                .vacationCount(vacationCount)
                .retirementYears(retirementYears)
                .build();
    }

    private int calculatePizzaCount(double profitLoss) {
        if (profitLoss <= 0) return 0;
        return (int) (profitLoss / averagePizzaPrice);
    }

    private int calculateVacationCount(double profitLoss) {
        if (profitLoss <= 0) return 0;
        return (int) (profitLoss / averageVacationPrice);
    }

    private double calculateRetirementYears(double profitLoss) {
        if (profitLoss <= 0) return 0;
        double monthsOfRetirement = profitLoss / monthlyRetirementExpense;
        return monthsOfRetirement / 12.0; // Convert to years
    }
}
