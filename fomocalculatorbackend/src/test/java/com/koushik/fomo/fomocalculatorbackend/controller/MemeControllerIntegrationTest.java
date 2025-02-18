package com.koushik.fomo.fomocalculatorbackend.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.koushik.fomo.fomocalculatorbackend.controller.MemeController.MemeRequest;
import com.koushik.fomo.fomocalculatorbackend.service.MemeGeneratorService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import static org.mockito.ArgumentMatchers.anyDouble;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(MemeController.class)
class MemeControllerIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private MemeGeneratorService memeGeneratorService;

    @Test
    void generateMeme_Success() throws Exception {
        MemeRequest request = new MemeRequest();
        request.setAssetName("Bitcoin");
        request.setProfitLoss(50000.0);
        request.setProfitLossPercentage(125.0);

        String expectedUrl = "http://localhost:8080/memes/test_meme.jpg";
        when(memeGeneratorService.generateMeme(anyString(), anyDouble(), anyDouble()))
            .thenReturn(expectedUrl);

        mockMvc.perform(post("/api/memes/generate")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.memeUrl").value(expectedUrl));
    }

    @Test
    void generateMeme_MissingAssetName() throws Exception {
        MemeRequest request = new MemeRequest();
        request.setProfitLoss(50000.0);
        request.setProfitLossPercentage(125.0);

        mockMvc.perform(post("/api/memes/generate")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
            .andExpect(status().isBadRequest());
    }

    @Test
    void generateMeme_ServiceError() throws Exception {
        MemeRequest request = new MemeRequest();
        request.setAssetName("Bitcoin");
        request.setProfitLoss(50000.0);
        request.setProfitLossPercentage(125.0);

        when(memeGeneratorService.generateMeme(anyString(), anyDouble(), anyDouble()))
            .thenThrow(new RuntimeException("Failed to generate meme"));

        mockMvc.perform(post("/api/memes/generate")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
            .andExpect(status().isBadRequest());
    }

    @Test
    void generateMeme_InvalidInput() throws Exception {
        String invalidJson = "invalid json";

        mockMvc.perform(post("/api/memes/generate")
                .contentType(MediaType.APPLICATION_JSON)
                .content(invalidJson))
            .andExpect(status().isBadRequest());
    }
}
