package com.koushik.fomo.fomocalculatorbackend.service;

import com.koushik.fomo.fomocalculatorbackend.config.FmpConfig;
import com.koushik.fomo.fomocalculatorbackend.exception.InvestmentCalculationException;
import lombok.extern.slf4j.Slf4j;
import com.koushik.fomo.fomocalculatorbackend.model.fmp.FmpHistoricalResponse;
import com.koushik.fomo.fomocalculatorbackend.model.fmp.FmpHistoricalPrice;
import lombok.RequiredArgsConstructor;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class FinancialDataService {
    private final RestTemplate restTemplate;
    private final FmpConfig fmpConfig;
    private static final DateTimeFormatter DATE_FORMATTER = DateTimeFormatter.ofPattern("yyyy-MM-dd");

    @Cacheable(value = "historicalPrices", key = "#symbol + '_' + #from.format(T(java.time.format.DateTimeFormatter).ofPattern('yyyy-MM-dd')) + '_' + #to.format(T(java.time.format.DateTimeFormatter).ofPattern('yyyy-MM-dd'))")
    public List<FmpHistoricalPrice> getHistoricalPrices(String symbol, LocalDate from, LocalDate to) {
        log.info("Cache miss - Fetching historical prices for symbol: {}, from: {}, to: {}", symbol, from, to);
        String url = UriComponentsBuilder
            .fromUriString(fmpConfig.getBaseUrl())
            .path("/historical-price-full/{symbol}")
            .queryParam("from", from.format(DATE_FORMATTER))
            .queryParam("to", to.format(DATE_FORMATTER))
            .queryParam("apikey", fmpConfig.getKey())
            .buildAndExpand(symbol)
            .toUriString();

        FmpHistoricalResponse response;
        try {
            response = restTemplate.getForObject(url, FmpHistoricalResponse.class);
            log.debug("Received response from FMP API for symbol: {}", symbol);
        } catch (Exception e) {
            log.error("Error fetching data from FMP API for symbol: {}", symbol, e);
            throw new InvestmentCalculationException("Failed to fetch historical data for " + symbol, e);
        }
        
        if (response == null || response.getPrices() == null || response.getPrices().isEmpty()) {
            log.warn("No historical data found for symbol: {}", symbol);
            throw new InvestmentCalculationException("No historical data found for symbol: " + symbol);
        }

        log.info("Successfully retrieved {} price points for symbol: {}", response.getPrices().size(), symbol);
        return response.getPrices();
    }

    @Cacheable(value = "priceForDate", key = "#symbol + '_' + #date.format(T(java.time.format.DateTimeFormatter).ofPattern('yyyy-MM-dd'))")
    public FmpHistoricalPrice getPriceForDate(String symbol, LocalDate date) {
        List<FmpHistoricalPrice> prices = getHistoricalPrices(symbol, date, date);
        return prices.get(0);
    }

    @Cacheable(value = "closestPrice", key = "#symbol + '_' + #date.format(T(java.time.format.DateTimeFormatter).ofPattern('yyyy-MM-dd'))")
    public double getClosestPrice(String symbol, LocalDate date) {
        // Get prices for a window around the target date to handle non-trading days
        LocalDate startDate = date.minusDays(5);
        LocalDate endDate = date.plusDays(5);
        
        List<FmpHistoricalPrice> prices = getHistoricalPrices(symbol, startDate, endDate);
        
        // Find the price entry closest to our target date
        return prices.stream()
            .min((p1, p2) -> {
                LocalDate d1 = LocalDate.parse(p1.getDate());
                LocalDate d2 = LocalDate.parse(p2.getDate());
                long diff1 = Math.abs(d1.toEpochDay() - date.toEpochDay());
                long diff2 = Math.abs(d2.toEpochDay() - date.toEpochDay());
                return Long.compare(diff1, diff2);
            })
            .map(FmpHistoricalPrice::getAdjustedClose)
            .orElseThrow(() -> new InvestmentCalculationException("No price data found for " + symbol + " around " + date));
    }
}
