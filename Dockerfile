FROM maven:3.9-eclipse-temurin-17 AS build
WORKDIR /app

# Copy the Maven POM and source code
COPY fomocalculatorbackend/pom.xml fomocalculatorbackend/
COPY fomocalculatorbackend/src/ fomocalculatorbackend/src/

# Build the application
WORKDIR /app/fomocalculatorbackend
RUN mvn clean package -DskipTests

# Runtime stage
FROM eclipse-temurin:17-jre-alpine
WORKDIR /app

# Copy the built artifact from the build stage
COPY --from=build /app/fomocalculatorbackend/target/*.jar app.jar

# Create directory for memes
RUN mkdir -p memes

# Set environment variables
ENV PORT=8080
ENV JAVA_OPTS="-XX:+UseContainerSupport -XX:MaxRAMPercentage=75.0"

# Expose the application port
EXPOSE 8080

# Run the application
CMD ["java", "-jar", "app.jar"]
