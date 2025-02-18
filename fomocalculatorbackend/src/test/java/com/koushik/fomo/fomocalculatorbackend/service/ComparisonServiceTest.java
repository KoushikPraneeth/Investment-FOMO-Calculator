package com.koushik.fomo.fomocalculatorbackend.service;

import com.koushik.fomo.fomocalculatorbackend.exception.InvestmentCalculationException;
import com.koushik.fomo.fomocalculatorbackend.model.ComparisonScenario;
import com.koushik.fomo.fomocalculatorbackend.model.InvestmentResult;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mock;

import java.time.LocalDate;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyDouble;
import static org.mockito.Mockito.when;
import static org.mockito.MockitoAnnotations.openMocks;

class ComparisonServiceTest {

    @Mock
    private CalculationService calculationService;

    private ComparisonService comparisonService;

    @BeforeEach
    void setUp() {
        openMocks(this);
        comparisonService = new ComparisonService(calculationService);
    }

    @Test
    void getAllScenarios_ReturnsNonEmptyList() {
        var scenarios = comparisonService.getAllScenarios();
        assertFalse(scenarios.isEmpty());
    }

    @Test
    void getScenarioById_ValidId_ReturnsScenario() {
        var scenario = comparisonService.getScenarioById("btc-vs-sp500");
        assertTrue(scenario.isPresent());
        assertEquals("Bitcoin vs S&P 500", scenario.get().getLabel());
    }

    @Test
    void getScenarioById_InvalidId_ReturnsEmpty() {
        var scenario = comparisonService.getScenarioById("invalid-id");
        assertTrue(scenario.isEmpty());
    }

    @Test
    void calculateComparison_Success() {
        // Setup mock results
        InvestmentResult mockResult1 = InvestmentResult.builder()
            .assetName("Bitcoin")
            .entryPrice(10000.0)
            .exitPrice(50000.0)
            .profitLoss(40000.0)
            .profitLossPercentage(400.0)
            .investmentAmount(10000.0)
            .build();

        InvestmentResult mockResult2 = InvestmentResult.builder()
            .assetName("S&P 500")
            .entryPrice(3000.0)
            .exitPrice(4000.0)
            .profitLoss(3333.33)
            .profitLossPercentage(33.33)
            .investmentAmount(10000.0)
            .build();

        when(calculationService.calculateInvestment(any(), any(), any(), anyDouble()))
            .thenReturn(mockResult1)
            .thenReturn(mockResult2);

        // Test data
        LocalDate entryDate = LocalDate.of(2020, 1, 1);
        LocalDate exitDate = LocalDate.of(2021, 1, 1);
        double amount = 10000.0;

        // Calculate comparison
        var result = comparisonService.calculateComparison("btc-vs-sp500", entryDate, exitDate, amount);

        // Verify
        assertNotNull(result);
        assertEquals("btc-vs-sp500", result.scenario().getId());
        assertEquals(mockResult1, result.asset1Result());
        assertEquals(mockResult2, result.asset2Result());
    }

    @Test
    void calculateComparison_InvalidScenarioId_ThrowsException() {
        LocalDate entryDate = LocalDate.of(2020, 1, 1);
        LocalDate exitDate = LocalDate.of(2021, 1, 1);
        double amount = 10000.0;

        assertThrows(InvestmentCalculationException.class, () -> 
            comparisonService.calculateComparison("invalid-id", entryDate, exitDate, amount)
        );
    }
}
