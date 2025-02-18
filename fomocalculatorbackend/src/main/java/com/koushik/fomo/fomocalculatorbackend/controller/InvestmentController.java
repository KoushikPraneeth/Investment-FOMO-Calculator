package com.koushik.fomo.fomocalculatorbackend.controller;

import com.koushik.fomo.fomocalculatorbackend.model.InvestmentResult;
import lombok.extern.slf4j.Slf4j;
import com.koushik.fomo.fomocalculatorbackend.service.CalculationService;
import com.koushik.fomo.fomocalculatorbackend.exception.InvestmentCalculationException;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;

@Slf4j
@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
@CrossOrigin(origins = "${spring.web.cors.allowed-origins}")
public class InvestmentController {
    private final CalculationService calculationService;

    @GetMapping("/calculate")
    public ResponseEntity<InvestmentResult> calculateInvestment(
            @RequestParam String symbol,
            @RequestParam @DateTimeFormat(pattern = "yyyy-MM-dd") LocalDate entryDate,
            @RequestParam @DateTimeFormat(pattern = "yyyy-MM-dd") LocalDate exitDate,
            @RequestParam double amount) {
            
        log.info("Received investment calculation request - Symbol: {}, Entry Date: {}, Exit Date: {}, Amount: ${}", 
            symbol, entryDate, exitDate, amount);
            
        // Input validation
        if (symbol == null || symbol.trim().isEmpty()) {
            log.warn("Invalid request: Empty asset symbol");
            throw new InvestmentCalculationException("Asset symbol is required");
        }

        if (amount <= 0) {
            log.warn("Invalid request: Investment amount {} is not positive", amount);
            throw new InvestmentCalculationException("Investment amount must be greater than 0");
        }

        if (exitDate.isBefore(entryDate)) {
            log.warn("Invalid request: Exit date {} is before entry date {}", exitDate, entryDate);
            throw new InvestmentCalculationException("Exit date must be after entry date");
        }

        // Calculate investment result
        InvestmentResult result = calculationService.calculateInvestment(
            symbol,
            entryDate,
            exitDate,
            amount
        );

        log.info("Successfully calculated investment result for symbol: {}", symbol);
        return ResponseEntity.ok(result);
    }
}
