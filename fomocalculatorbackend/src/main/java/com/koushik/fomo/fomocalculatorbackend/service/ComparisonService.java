package com.koushik.fomo.fomocalculatorbackend.service;

import com.koushik.fomo.fomocalculatorbackend.model.ComparisonScenario;
import com.koushik.fomo.fomocalculatorbackend.model.InvestmentResult;
import com.koushik.fomo.fomocalculatorbackend.exception.InvestmentCalculationException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.Arrays;

@Service
@RequiredArgsConstructor
@Slf4j
public class ComparisonService {
    private final CalculationService calculationService;

    private final List<ComparisonScenario> predefinedScenarios = Arrays.asList(
        ComparisonScenario.builder()
            .id("btc-vs-sp500")
            .label("Bitcoin vs S&P 500")
            .asset1Symbol("BTC")
            .asset2Symbol("SPY")
            .asset1Name("Bitcoin")
            .asset2Name("S&P 500")
            .description("Compare Bitcoin's performance against the traditional S&P 500 index")
            .build(),
        ComparisonScenario.builder()
            .id("eth-vs-tesla")
            .label("Ethereum vs Tesla")
            .asset1Symbol("ETH")
            .asset2Symbol("TSLA")
            .asset1Name("Ethereum")
            .asset2Name("Tesla")
            .description("Compare Ethereum's growth against Tesla's meteoric rise")
            .build(),
        ComparisonScenario.builder()
            .id("btc-vs-gold")
            .label("Bitcoin vs Gold")
            .asset1Symbol("BTC")
            .asset2Symbol("GLD")
            .asset1Name("Bitcoin")
            .asset2Name("Gold")
            .description("Digital gold vs Traditional gold: Compare Bitcoin with the classic store of value")
            .build()
    );

    public List<ComparisonScenario> getAllScenarios() {
        return predefinedScenarios;
    }

    public Optional<ComparisonScenario> getScenarioById(String id) {
        return predefinedScenarios.stream()
                .filter(scenario -> scenario.getId().equals(id))
                .findFirst();
    }

    public record ComparisonResult(
        ComparisonScenario scenario,
        InvestmentResult asset1Result,
        InvestmentResult asset2Result
    ) {}

    public ComparisonResult calculateComparison(
            String scenarioId,
            LocalDate entryDate,
            LocalDate exitDate,
            double investmentAmount) {
        
        log.info("Calculating comparison for scenario: {}, entry: {}, exit: {}, amount: ${}",
                scenarioId, entryDate, exitDate, investmentAmount);

        ComparisonScenario scenario = getScenarioById(scenarioId)
                .orElseThrow(() -> new InvestmentCalculationException("Invalid comparison scenario ID: " + scenarioId));

        // Calculate results for both assets
        InvestmentResult asset1Result = calculationService.calculateInvestment(
                scenario.getAsset1Symbol(),
                entryDate,
                exitDate,
                investmentAmount
        );

        InvestmentResult asset2Result = calculationService.calculateInvestment(
                scenario.getAsset2Symbol(),
                entryDate,
                exitDate,
                investmentAmount
        );

        log.info("Comparison calculation completed for scenario: {}", scenarioId);
        return new ComparisonResult(scenario, asset1Result, asset2Result);
    }
}
