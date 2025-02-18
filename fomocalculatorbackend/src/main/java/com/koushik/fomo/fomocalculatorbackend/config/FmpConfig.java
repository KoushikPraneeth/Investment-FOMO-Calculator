package com.koushik.fomo.fomocalculatorbackend.config;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.client.RestTemplate;
import lombok.Data;
import org.springframework.boot.web.client.RestTemplateBuilder;

@Configuration
@ConfigurationProperties(prefix = "fmp.api")
@Data
public class FmpConfig {
    private String key;
    private String baseUrl;

    @Bean
    public RestTemplate restTemplate(RestTemplateBuilder builder) {
        return builder.build();
    }
}
