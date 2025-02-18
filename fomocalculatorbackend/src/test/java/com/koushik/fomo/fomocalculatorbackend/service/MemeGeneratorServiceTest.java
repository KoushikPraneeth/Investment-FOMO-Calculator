package com.koushik.fomo.fomocalculatorbackend.service;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mock;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.core.io.Resource;
import org.springframework.core.io.ResourceLoader;

import java.awt.image.BufferedImage;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;

import javax.imageio.ImageIO;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.when;
import static org.mockito.MockitoAnnotations.openMocks;

class MemeGeneratorServiceTest {
    @Mock
    private ResourceLoader resourceLoader;

    @Mock
    private Resource mockResource;

    private MemeGeneratorService memeGeneratorService;
    private Path tempDir;

    @BeforeEach
    void setUp() throws IOException {
        openMocks(this);
        
        // Create a temporary directory for meme storage
        tempDir = Files.createTempDirectory("meme-test");

        // Create a dummy image for testing
        BufferedImage dummyImage = new BufferedImage(400, 300, BufferedImage.TYPE_INT_RGB);
        Path dummyImagePath = tempDir.resolve("dummy.jpg");
        ImageIO.write(dummyImage, "jpg", dummyImagePath.toFile());

        // Set up mock responses
        when(resourceLoader.getResource(anyString())).thenReturn(mockResource);
        when(mockResource.getInputStream()).thenAnswer(invocation -> Files.newInputStream(dummyImagePath));
        
        // Initialize service with test configuration
        memeGeneratorService = new MemeGeneratorService(
            resourceLoader,
            tempDir.toString(),
            "http://localhost:8080"
        );
    }

    @Test
    void generateMeme_Success() throws IOException {
        // Test data
        String assetName = "Bitcoin";
        double profitLoss = 50000.0;
        double profitLossPercentage = 125.0;

        // Generate meme
        String memeUrl = memeGeneratorService.generateMeme(assetName, profitLoss, profitLossPercentage);

        // Verify
        assertNotNull(memeUrl);
        assertTrue(memeUrl.startsWith("http://localhost:8080/memes/"));
        assertTrue(memeUrl.endsWith(".jpg"));

        // Verify file exists
        String filename = memeUrl.substring(memeUrl.lastIndexOf('/') + 1);
        assertTrue(Files.exists(tempDir.resolve(filename)));
    }

    @Test
    void generateMeme_WithNegativeProfitLoss() throws IOException {
        // Test data
        String assetName = "Bitcoin";
        double profitLoss = -50000.0;
        double profitLossPercentage = -25.0;

        // Generate meme
        String memeUrl = memeGeneratorService.generateMeme(assetName, profitLoss, profitLossPercentage);

        // Verify
        assertNotNull(memeUrl);
        assertTrue(memeUrl.startsWith("http://localhost:8080/memes/"));
        assertTrue(memeUrl.endsWith(".jpg"));
    }
}
