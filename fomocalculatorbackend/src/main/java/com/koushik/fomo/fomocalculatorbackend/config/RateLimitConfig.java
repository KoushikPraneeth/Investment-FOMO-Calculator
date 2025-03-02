package com.koushik.fomo.fomocalculatorbackend.config;

import io.github.bucket4j.Bandwidth;
import io.github.bucket4j.Bucket;
import io.github.bucket4j.Bucket4j;
import io.github.bucket4j.Refill;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.time.Duration;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Configuration
public class RateLimitConfig {

    @Value("${rate.limit.requests-per-minute:30}")
    private int requestsPerMinute;

    @Bean
    public Map<String, Bucket> ipToBucketCache() {
        return new ConcurrentHashMap<>();
    }

    public Bucket createNewBucket() {
        // Define bandwidth limit based on configuration
        Bandwidth limit = Bandwidth.classic(requestsPerMinute, Refill.greedy(requestsPerMinute, Duration.ofMinutes(1)));
        return Bucket4j.builder().addLimit(limit).build();
    }
}
