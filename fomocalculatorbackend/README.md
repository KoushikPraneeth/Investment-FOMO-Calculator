# Investment FOMO Calculator Backend

This is the backend service for the Investment FOMO Calculator application. It provides APIs for calculating investment returns, comparing different investment scenarios, and generating FOMO-related memes.

## Features

### Core Features
- Calculate investment returns based on historical price data
- Compute profit/loss and percentage returns
- Calculate auxiliary metrics (pizza count, vacation count, retirement years)
- Integration with Financial Modeling Prep API for real market data

### Comparison Features
- Predefined comparison scenarios (e.g., Bitcoin vs S&P 500)
- Side-by-side investment performance analysis
- Support for custom comparison parameters

### Meme Generation
- Dynamic meme generation based on investment results
- Different templates for profit and loss scenarios
- Custom text overlay with investment results

## API Endpoints

### Investment Calculation
```
GET /api/calculate
Parameters:
- symbol: Asset symbol (e.g., "BTC", "AAPL")
- entryDate: Investment entry date (YYYY-MM-DD)
- exitDate: Investment exit date (YYYY-MM-DD)
- amount: Investment amount
```

### Comparison
```
GET /api/comparisons
Returns list of available comparison scenarios

GET /api/comparisons/{id}
Returns specific comparison scenario details

GET /api/comparisons/calculate
Parameters:
- scenarioId: ID of comparison scenario
- entryDate: Investment entry date (YYYY-MM-DD)
- exitDate: Investment exit date (YYYY-MM-DD)
- amount: Investment amount
```

### Meme Generation
```
POST /api/memes/generate
Body:
{
    "assetName": "Asset name",
    "profitLoss": 0.0,
    "profitLossPercentage": 0.0
}
```

## Configuration

### Financial Modeling Prep API
```properties
fmp.api.key=your-api-key
fmp.api.baseUrl=https://financialmodelingprep.com/api/v3
```

### Auxiliary Metrics
```properties
metrics.pizza.averagePrice=15.00
metrics.vacation.averagePrice=1000.00
metrics.retirement.monthlyExpense=3000.00
```

### Meme Generation
```properties
meme.upload.dir=memes
meme.base.url=http://localhost:8080
```

## Development

### Prerequisites
- Java 17 or later
- Maven
- Financial Modeling Prep API key

### Building
```bash
mvn clean install
```

### Running
```bash
mvn spring-boot:run
```

### Testing
```bash
mvn test
```

## Project Structure
```
src/
├── main/
│   ├── java/
│   │   └── com/koushik/fomo/fomocalculatorbackend/
│   │       ├── config/
│   │       ├── controller/
│   │       ├── exception/
│   │       ├── model/
│   │       └── service/
│   └── resources/
│       ├── application.properties
│       └── meme-templates/
└── test/
    ├── java/
    └── resources/
