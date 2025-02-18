package com.koushik.fomo.fomocalculatorbackend.controller;

import com.koushik.fomo.fomocalculatorbackend.service.MemeGeneratorService;
import lombok.RequiredArgsConstructor;
import lombok.Data;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/memes")
@RequiredArgsConstructor
@CrossOrigin(origins = "${spring.web.cors.allowed-origins}")
@Slf4j
public class MemeController {
    private final MemeGeneratorService memeGeneratorService;

    @Data
    public static class MemeRequest {
        private String assetName;
        private double profitLoss;
        private double profitLossPercentage;
    }

    @Data
    public static class MemeResponse {
        private String memeUrl;
    }

    @PostMapping("/generate")
    public ResponseEntity<MemeResponse> generateMeme(@RequestBody MemeRequest request) {
        log.info("Received meme generation request for asset: {}", request.getAssetName());

        if (request.getAssetName() == null || request.getAssetName().trim().isEmpty()) {
            log.warn("Invalid request: Missing asset name");
            return ResponseEntity.badRequest().build();
        }

        try {
            String memeUrl = memeGeneratorService.generateMeme(
                request.getAssetName(),
                request.getProfitLoss(),
                request.getProfitLossPercentage()
            );

            MemeResponse response = new MemeResponse();
            response.setMemeUrl(memeUrl);

            log.info("Meme generated successfully, URL: {}", memeUrl);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("Failed to generate meme", e);
            return ResponseEntity.badRequest().build();
        }
    }
}
