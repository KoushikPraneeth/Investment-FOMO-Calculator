package com.koushik.fomo.fomocalculatorbackend.service;

import com.koushik.fomo.fomocalculatorbackend.exception.InvestmentCalculationException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.ResourceLoader;
import org.springframework.stereotype.Service;

import javax.imageio.ImageIO;
import java.awt.*;
import java.awt.image.BufferedImage;
import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.UUID;

@Service
@Slf4j
public class MemeGeneratorService {

    private final ResourceLoader resourceLoader;
    private final String uploadDir;
    private final String baseUrl;

    public MemeGeneratorService(
            ResourceLoader resourceLoader,
            @Value("${meme.upload.dir:memes}") String uploadDir,
            @Value("${meme.base.url:http://localhost:8080}") String baseUrl) {
        this.resourceLoader = resourceLoader;
        this.uploadDir = uploadDir;
        this.baseUrl = baseUrl;

        // Create memes directory if it doesn't exist
        try {
            Files.createDirectories(Paths.get(uploadDir));
        } catch (IOException e) {
            throw new RuntimeException("Could not create meme upload directory", e);
        }
    }

    public String generateMeme(String assetName, double profitLoss, double profitLossPercentage) {
        log.info("Generating meme for asset: {}, profit/loss: ${}", assetName, profitLoss);

        try {
            // Choose template based on profit/loss
            String templateName = profitLoss >= 0 ? "profit_template.jpg" : "loss_template.jpg";
            var templateResource = resourceLoader.getResource("classpath:meme-templates/" + templateName);
            BufferedImage template = ImageIO.read(templateResource.getInputStream());

            // Create a copy of the template to work with
            BufferedImage meme = new BufferedImage(
                template.getWidth(),
                template.getHeight(),
                BufferedImage.TYPE_INT_RGB
            );

            // Get graphics context for drawing
            Graphics2D g2d = meme.createGraphics();
            g2d.drawImage(template, 0, 0, null);

            // Configure text rendering
            g2d.setColor(Color.WHITE);
            g2d.setRenderingHint(
                RenderingHints.KEY_TEXT_ANTIALIASING,
                RenderingHints.VALUE_TEXT_ANTIALIAS_ON
            );

            // Draw text
            int fontSize = Math.min(template.getWidth() / 15, 48);
            Font font = new Font("Arial", Font.BOLD, fontSize);
            g2d.setFont(font);

            // Calculate text positions (centered)
            String topText = String.format("If I had invested in %s", assetName);
            String bottomText = String.format("%s $%.2f (%.1f%%)",
                profitLoss >= 0 ? "I could have made" : "I could have lost",
                Math.abs(profitLoss),
                Math.abs(profitLossPercentage));

            FontMetrics metrics = g2d.getFontMetrics(font);
            int topX = (template.getWidth() - metrics.stringWidth(topText)) / 2;
            int bottomX = (template.getWidth() - metrics.stringWidth(bottomText)) / 2;

            // Add text stroke (outline) for better visibility
            g2d.setStroke(new BasicStroke(3));
            g2d.setColor(Color.BLACK);
            g2d.drawString(topText, topX, fontSize + 10);
            g2d.drawString(bottomText, bottomX, template.getHeight() - fontSize - 10);

            // Fill text
            g2d.setColor(Color.WHITE);
            g2d.drawString(topText, topX, fontSize + 10);
            g2d.drawString(bottomText, bottomX, template.getHeight() - fontSize - 10);

            g2d.dispose();

            // Save the meme
            String filename = generateFileName(assetName);
            Path filePath = Paths.get(uploadDir, filename);
            ImageIO.write(meme, "jpg", filePath.toFile());

            log.info("Meme generated successfully: {}", filename);
            return baseUrl + "/memes/" + filename;

        } catch (IOException e) {
            log.error("Failed to generate meme", e);
            throw new InvestmentCalculationException("Failed to generate meme", e);
        }
    }

    private String generateFileName(String assetName) {
        String timestamp = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMddHHmmss"));
        String randomId = UUID.randomUUID().toString().substring(0, 8);
        return String.format("meme_%s_%s_%s.jpg", 
            assetName.toLowerCase().replaceAll("[^a-z0-9]", ""),
            timestamp,
            randomId);
    }
}
