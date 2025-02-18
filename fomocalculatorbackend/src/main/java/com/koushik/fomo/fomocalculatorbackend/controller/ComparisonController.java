package com.koushik.fomo.fomocalculatorbackend.controller;

import com.koushik.fomo.fomocalculatorbackend.model.ComparisonScenario;
import com.koushik.fomo.fomocalculatorbackend.service.ComparisonService;
import com.koushik.fomo.fomocalculatorbackend.service.ComparisonService.ComparisonResult;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/comparisons")
@RequiredArgsConstructor
@CrossOrigin(origins = "${spring.web.cors.allowed-origins}")
@Slf4j
public class ComparisonController {
    private final ComparisonService comparisonService;

    @GetMapping
    public ResponseEntity<List<ComparisonScenario>> getAllScenarios() {
        log.info("Fetching all comparison scenarios");
        return ResponseEntity.ok(comparisonService.getAllScenarios());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ComparisonScenario> getScenarioById(@PathVariable String id) {
        log.info("Fetching comparison scenario with id: {}", id);
        return comparisonService.getScenarioById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/calculate")
    public ResponseEntity<ComparisonResult> calculateComparison(
            @RequestParam String scenarioId,
            @RequestParam @DateTimeFormat(pattern = "yyyy-MM-dd") LocalDate entryDate,
            @RequestParam @DateTimeFormat(pattern = "yyyy-MM-dd") LocalDate exitDate,
            @RequestParam double amount) {

        log.info("Calculating comparison - Scenario: {}, Entry: {}, Exit: {}, Amount: ${}",
                scenarioId, entryDate, exitDate, amount);

        // Input validation
        if (amount <= 0) {
            log.warn("Invalid request: Investment amount {} is not positive", amount);
            return ResponseEntity.badRequest().build();
        }

        if (exitDate.isBefore(entryDate)) {
            log.warn("Invalid request: Exit date {} is before entry date {}", exitDate, entryDate);
            return ResponseEntity.badRequest().build();
        }

        try {
            ComparisonResult result = comparisonService.calculateComparison(
                scenarioId,
                entryDate,
                exitDate,
                amount
            );

            log.info("Successfully calculated comparison for scenario: {}", scenarioId);
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            log.error("Error calculating comparison", e);
            return ResponseEntity.badRequest().build();
        }
    }
}
