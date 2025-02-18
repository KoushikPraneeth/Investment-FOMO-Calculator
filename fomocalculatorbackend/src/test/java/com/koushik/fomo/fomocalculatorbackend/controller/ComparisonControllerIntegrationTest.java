package com.koushik.fomo.fomocalculatorbackend.controller;

import com.koushik.fomo.fomocalculatorbackend.model.ComparisonScenario;
import com.koushik.fomo.fomocalculatorbackend.service.ComparisonService;
import com.koushik.fomo.fomocalculatorbackend.service.ComparisonService.ComparisonResult;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.time.LocalDate;
import java.util.Arrays;
import java.util.Optional;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyDouble;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(ComparisonController.class)
class ComparisonControllerIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private ComparisonService comparisonService;

    @Test
    void getAllScenarios_Success() throws Exception {
        ComparisonScenario scenario = ComparisonScenario.builder()
            .id("btc-vs-sp500")
            .label("Bitcoin vs S&P 500")
            .asset1Symbol("BTC")
            .asset2Symbol("SPY")
            .build();

        when(comparisonService.getAllScenarios()).thenReturn(Arrays.asList(scenario));

        mockMvc.perform(get("/api/comparisons"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$[0].id").value("btc-vs-sp500"))
            .andExpect(jsonPath("$[0].label").value("Bitcoin vs S&P 500"));
    }

    @Test
    void getScenarioById_Success() throws Exception {
        ComparisonScenario scenario = ComparisonScenario.builder()
            .id("btc-vs-sp500")
            .label("Bitcoin vs S&P 500")
            .asset1Symbol("BTC")
            .asset2Symbol("SPY")
            .build();

        when(comparisonService.getScenarioById("btc-vs-sp500")).thenReturn(Optional.of(scenario));

        mockMvc.perform(get("/api/comparisons/btc-vs-sp500"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.id").value("btc-vs-sp500"))
            .andExpect(jsonPath("$.label").value("Bitcoin vs S&P 500"));
    }

    @Test
    void getScenarioById_NotFound() throws Exception {
        when(comparisonService.getScenarioById("invalid-id")).thenReturn(Optional.empty());

        mockMvc.perform(get("/api/comparisons/invalid-id"))
            .andExpect(status().isNotFound());
    }

    @Test
    void calculateComparison_Success() throws Exception {
        ComparisonScenario scenario = ComparisonScenario.builder()
            .id("btc-vs-sp500")
            .label("Bitcoin vs S&P 500")
            .asset1Symbol("BTC")
            .asset2Symbol("SPY")
            .build();

        ComparisonResult mockResult = new ComparisonResult(
            scenario,
            null, // You can add mock InvestmentResult objects here if needed
            null
        );

        when(comparisonService.calculateComparison(
            anyString(), any(LocalDate.class), any(LocalDate.class), anyDouble()
        )).thenReturn(mockResult);

        mockMvc.perform(get("/api/comparisons/calculate")
                .param("scenarioId", "btc-vs-sp500")
                .param("entryDate", "2020-01-01")
                .param("exitDate", "2021-01-01")
                .param("amount", "10000")
                .contentType(MediaType.APPLICATION_JSON))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.scenario.id").value("btc-vs-sp500"));
    }

    @Test
    void calculateComparison_InvalidInput() throws Exception {
        mockMvc.perform(get("/api/comparisons/calculate")
                .param("scenarioId", "btc-vs-sp500")
                .param("entryDate", "2021-01-01") // Exit date before entry date
                .param("exitDate", "2020-01-01")
                .param("amount", "10000")
                .contentType(MediaType.APPLICATION_JSON))
            .andExpect(status().isBadRequest());
    }
}
