# Phase-by-Phase Project Plan: Investment FOMO Time Machine & Regret Calculator

This document provides a more granular breakdown of the development phases outlined in `plan.md`. Follow these steps to build your "Investment FOMO Time Machine & Regret Calculator" project in a structured manner.

---

## Phase 1: Project Setup & Backend Core (1-2 weeks)

**Goal:** Set up the basic Spring Boot backend project structure and implement the core API endpoint for fetching historical financial data and performing basic profit/loss calculations.

**Tasks:**

1. **Backend Project Setup (Spring Boot):**

   - [ ] **Set up a new Spring Boot project:**
     - Choose your preferred IDE (IntelliJ IDEA, Eclipse, VS Code with Spring Boot extensions).
     - Use Spring Initializr (start.spring.io) to generate a basic Spring Boot project.
     - Include necessary dependencies: `Spring Web`, `Spring Boot DevTools` (optional but helpful), and potentially `Lombok` (optional).
     - Choose Java or Kotlin as your language.
     - Select Maven or Gradle as your build tool.
   - [ ] **Project Structure:** Organize your project into logical packages (e.g., `controller`, `service`, `model`, `config`).
   - [ ] **Basic Controller Setup:** Create a simple REST controller (e.g., `InvestmentController`) with a basic endpoint (e.g., `/api/data`).

2. **Financial Data API Integration:**

   - [ ] **Choose a Financial Data API:** (e.g., Financial Modeling Prep, Alpha Vantage, research free options).
   - [ ] **API Key Acquisition:** Sign up for an account and obtain your API key (if required).
   - [ ] **Explore API Documentation:** Thoroughly read the API documentation to understand endpoints for historical data, request parameters, and response formats.
   - [ ] **Create a Service for API Calls:** Create a Spring Service (e.g., `FinancialDataService`) to encapsulate API calls.
   - [ ] **Implement Data Fetching Logic:**
     - In `FinancialDataService`, write a method to fetch historical price data for a given asset symbol and date range using the chosen API.
     - Handle API requests using `RestTemplate` or `WebClient` in Spring Boot.
     - Implement basic error handling for API requests (e.g., handle API errors, invalid responses).
   - [ ] **Test API Integration:** Use tools like Postman, curl, or your browser to test the API endpoint in your service and verify that you are successfully fetching data.

3. **Profit/Loss Calculation Logic:**

   - [ ] **Create a Model Class:** Define a Java/Kotlin class (e.g., `InvestmentResult`) to represent the result of the calculation (entry price, exit price, profit, loss, etc.).
   - [ ] **Implement Calculation Service:** Create a Spring Service (e.g., `CalculationService`) to handle profit/loss calculations.
   - [ ] **Write Calculation Method:** In `CalculationService`, implement a method that takes historical price data, investment amount, entry date, and exit date as input and calculates the profit/loss.
     - Consider different calculation scenarios (e.g., buying whole shares vs. fractional shares).
   - [ ] **Integrate Calculation in Controller:** Modify your controller endpoint (`/api/data`) to:
     - Call `FinancialDataService` to fetch historical data.
     - Call `CalculationService` to calculate profit/loss using the fetched data and user input parameters (which will be hardcoded for now for testing).
     - Return the `InvestmentResult` as a JSON response.
   - [ ] **Test Backend Logic:** Use Postman or curl to send requests to your controller endpoint and verify that the profit/loss calculation is correct based on sample data.

4. **Basic API Testing:**
   - [ ] **Use Postman or Curl:** Systematically test your API endpoints with different inputs (asset symbols, date ranges, investment amounts).
   - [ ] **Verify Responses:** Check that the API returns the expected data in the correct format (JSON).
   - [ ] **Error Handling Testing:** Test error scenarios (e.g., invalid asset symbol, invalid date format) and verify that your API handles errors gracefully and returns appropriate error responses.

**Phase 1 Deliverables:**

- [ ] Functional Spring Boot backend project with basic REST API endpoint.
- [ ] Successful integration with a financial data API and data fetching capability.
- [ ] Implementation of core profit/loss calculation logic.
- [ ] Basic API testing completed.
- [ ] Code committed to Git repository.

---

## Phase 2: Frontend Core & Time Machine UI (1-2 weeks)

**Goal:** Set up the basic frontend project structure and create the core "Time Machine" UI, allowing users to interact with the application and see basic results from the backend.

**Tasks:**

1. **Frontend Project Setup (React/Vue.js):**

   - [ ] **Choose a Frontend Framework/Library:** (React recommended for resume impact, Vue.js for easier learning curve).
   - [ ] **Set up a new Frontend Project:**
     - If using React: Use `create-react-app` or Vite for React.
     - If using Vue.js: Use Vue CLI or Vite for Vue.js.
   - [ ] **Project Structure:** Organize your frontend project (components, services/utils, styles, etc.).
   - [ ] **Basic Component Setup:** Create basic components for:
     - Asset Selection (e.g., `AssetDropdown` or `AssetSearch`).
     - Date Range Picker (use a library like `react-datepicker` or `vue-datepicker`).
     - Investment Amount Input (`AmountInput`).
     - Results Display (`ResultsDisplay`).

2. **Frontend API Integration:**

   - [ ] **Choose an HTTP Client:** (e.g., `axios` or `fetch` API in JavaScript).
   - [ ] **Create an API Service (Frontend):** Create a frontend service (e.g., `apiService.js` or `apiService.ts`) to handle API calls to your Spring Boot backend.
   - [ ] **Implement Data Fetching Function:** In your API service, write a function to call your backend API endpoint (`/api/data`) and pass user-selected parameters (asset, dates, amount).
   - [ ] **Connect Frontend to Backend:**
     - In your main component (e.g., `App.js` or `App.vue`), use state management (e.g., `useState` in React or `ref` and `reactive` in Vue.js) to store user inputs and API results.
     - When the user interacts with UI elements (e.g., clicks a "Calculate" button), trigger the API call using your frontend API service.
     - Update the component state with the API response.

3. **Time Machine UI Implementation:**

   - [ ] **Implement UI Components:** Develop the UI components you created in step 1.
     - Use UI component libraries (Material UI, Ant Design, Bootstrap, etc.) for styling and pre-built components to speed up development and improve visual appeal.
     - Make the components interactive and handle user input.
   - [ ] **Layout and Styling (Basic):** Create a basic layout for the Time Machine interface. Apply basic styling using CSS or a CSS framework to make it visually presentable (focus on functionality first, styling can be improved later).
   - [ ] **Display Results in UI:** In your `ResultsDisplay` component, render the data received from the backend API (profit, loss, entry price, exit price, etc.) in a clear and understandable format.

4. **Basic Frontend Testing & Interaction:**
   - [ ] **Test UI Components:** Test each UI component individually to ensure they are working correctly (handling input, displaying data).
   - [ ] **End-to-End Testing (Basic):** Test the entire flow from user input to API call to result display.
   - [ ] **Browser Compatibility Testing (Basic):** Test your frontend in at least one major browser (Chrome, Firefox, Safari, Edge).

**Phase 2 Deliverables:**

- [ ] Functional frontend project set up with chosen framework/library.
- [ ] Core "Time Machine" UI implemented with asset selection, date pickers, and amount input.
- [ ] Frontend connected to the Spring Boot backend API to fetch data and display basic results.
- [ ] Basic UI styling and layout implemented.
- [ ] Basic frontend testing and interaction verified.
- [ ] Code committed to Git repository.

---

## Phase 3: Pain Scale Visualizer & Meme Generator (2-3 weeks)

**Goal:** Implement the "Pain Scale Visualizer" and "Meme Generator" features to enhance the project's engagement and entertainment value.

**Tasks:**

1. **Pain Scale Visualizer Backend Logic:**

   - [ ] **Pizza Counter Logic (Backend):**
     - In `CalculationService`, add logic to calculate "number of pizzas missed" based on profit/loss and an average pizza price (you can hardcode an average price or fetch it from an external API if you want to be more dynamic).
   - [ ] **Vacation Counter Logic (Backend):**
     - Add logic to calculate "number of vacations missed" based on profit/loss and an average vacation cost (similarly, hardcode or use an API for vacation cost).
   - [ ] **Retirement Years (Simplified) Logic (Backend):**
     - Implement simplified logic to calculate "retirement contribution" or "potential early retirement months/years" based on profit/loss and some assumptions (e.g., average retirement savings rate). Keep it simple for a fresher project.
   - [ ] **Update API Response:** Modify your backend API endpoint to include the calculated values for Pizza Counter, Vacation Counter, and Retirement Years in the `InvestmentResult` JSON response.

2. **Pain Scale Visualizer Frontend UI:**

   - [ ] **Create Pain Scale UI Components:** Create frontend components to visually represent the Pain Scale metrics:
     - `PizzaCounterDisplay` (display number of pizzas with an icon or progress bar).
     - `VacationCounterDisplay` (display number of vacations with an icon or progress bar).
     - `RetirementYearsDisplay` (display retirement contribution/years in a clear way).
   - [ ] **Integrate Pain Scale Displays:** In your `ResultsDisplay` component, integrate these new Pain Scale components to display the calculated metrics alongside the basic profit/loss results.
   - [ ] **Visual Enhancements:** Add visual elements like progress bars, gauges, or simple icons to make the Pain Scale more engaging and visually appealing.

3. **Meme Generator Backend Implementation:**

   - [ ] **Choose a Java Image Library:** (Java ImageIO, ImgScalr, research meme-specific libraries if available).
   - [ ] **Design Meme Templates:** Create a few funny meme templates related to investment regret (using image editing software like Photoshop, GIMP, or online meme generators). Save these template images in your backend project (e.g., in `resources/static/memes`).
   - [ ] **Meme Generation Service (Backend):** Create a new Spring Service (e.g., `MemeGeneratorService`).
   - [ ] **Implement Meme Generation Logic:** In `MemeGeneratorService`, write a method to:
     - Load a meme template image.
     - Overlay dynamic text (profit/loss amount, asset name) onto the template using the chosen Java image library.
     - Generate a unique file name for the generated meme image.
     - Save the generated meme image to a temporary location on the server (or consider storing in cloud storage for scalability if desired, but temporary local storage is fine for this project).
     - Return the path or URL to the generated meme image.
   - [ ] **Create Meme Generation API Endpoint:** Create a new API endpoint in your `InvestmentController` (e.g., `/api/generate-meme`) that:
     - Takes profit/loss amount and asset name as input parameters.
     - Calls `MemeGeneratorService` to generate a meme image.
     - Returns the URL or path to the generated meme image in the API response.

4. **Meme Generator Frontend UI:**

   - [ ] **Create Meme Display Component:** Create a frontend component (e.g., `MemeDisplay`) to display the generated meme image.
   - [ ] **Implement "Generate Meme" Button:** Add a button in your UI (e.g., in `ResultsDisplay`) that triggers the meme generation process.
   - [ ] **Frontend Meme Generation Logic:**
     - When the "Generate Meme" button is clicked, make an API call to your backend `/api/generate-meme` endpoint, passing profit/loss and asset name.
     - When the API response returns the meme image URL, update the state to display the meme image using the `MemeDisplay` component.
   - [ ] **Meme Download/Share Functionality (Basic):**
     - Add a "Download Meme" button to allow users to download the generated meme image.
     - Implement basic social sharing buttons (e.g., using libraries like `react-share` or `vue-social-sharing`) to allow users to share the meme on social media (Twitter, Facebook - start with one or two).

5. **Testing Pain Scale & Meme Generator:**
   - [ ] **Test Pain Scale Metrics:** Verify that the Pizza Counter, Vacation Counter, and Retirement Years calculations are correct and displayed accurately in the UI.
   - [ ] **Test Meme Generation API:** Test the `/api/generate-meme` endpoint with different profit/loss amounts and asset names.
   - [ ] **Test Meme Display in Frontend:** Verify that generated memes are displayed correctly in the frontend UI.
   - [ ] **Test Meme Download/Share Functionality:** Test that the download and share buttons are working as expected.

**Phase 3 Deliverables:**

- [ ] Pain Scale Visualizer features implemented in both backend and frontend.
- [ ] Meme Generator feature implemented in both backend and frontend, including meme generation, display, and basic download/sharing.
- [ ] Enhanced UI with Pain Scale and Meme Generator elements.
- [ ] Testing of Pain Scale and Meme Generator features completed.
- [ ] Code committed to Git repository.

---

## Phase 4: Enhanced Features & Polish (1-2 weeks)

**Goal:** Implement the "Comparison Feature," "Reality Check Features," basic data visualizations, and polish the overall application for a better user experience.

**Tasks:**

1. **Comparison Feature ("Bitcoin vs. iPhone"):**

   - [ ] **Predefined Comparison Data (Backend):** Create a configuration or data structure in your backend to store predefined asset comparison scenarios (e.g., "Bitcoin vs. S&P 500," "Ethereum vs. Tesla," "Bitcoin vs. iPhone cost").
   - [ ] **Comparison Feature API Endpoint (Backend):** Create a new API endpoint (e.g., `/api/comparisons`) that returns a list of predefined comparison scenarios to the frontend.
   - [ ] **Comparison Feature UI (Frontend):**
     - Create a UI component (e.g., `ComparisonDropdown` or `ComparisonList`) to display the predefined comparison options to the user.
     - When the user selects a comparison, trigger the Time Machine calculation for both assets in the comparison and display the results side-by-side.
   - [ ] **Display Side-by-Side Results:** Modify your `ResultsDisplay` component to handle and display side-by-side results for comparison scenarios, showing the performance of both assets.

2. **Reality Check Features:**

   - [ ] **Risk Disclaimer (Frontend):** Add a prominent disclaimer in the UI (e.g., at the bottom of the results section) stating "Past performance is not indicative of future results."
   - [ ] **"But You Could Have Also Lost..." Scenario (Optional, Frontend):**
     - Implement a toggle or checkbox in the UI that, when activated, shows a "counter-scenario" where the investment went _down_ during the same period. This can be done by calculating the _lowest_ price within the selected date range and showing the potential loss if the user had bought at the entry date and sold at the lowest point. (This is optional and can be simplified or skipped if time is limited).

3. **Basic Data Visualizations (Frontend):**

   - [ ] **Choose a Charting Library:** (Chart.js is recommended for ease of use, D3.js for more advanced visualizations - Chart.js is good for MVP).
   - [ ] **Implement Basic Line Chart:**
     - In your frontend, use the chosen charting library to create a basic line chart that displays the price history of the selected asset during the user-selected date range.
     - Highlight the entry and exit points on the chart.
     - Display the chart in your `ResultsDisplay` component.
   - [ ] **Chart Data Preparation (Frontend):** Ensure that you are formatting the historical price data from the API in a way that is compatible with your charting library.

4. **Error Handling and User Feedback:**

   - [ ] **Frontend Error Handling:** Implement error handling in your frontend to gracefully handle API errors (e.g., network errors, API response errors). Display user-friendly error messages to the user if something goes wrong.
   - [ ] **Loading States/Indicators:** Implement loading indicators (e.g., spinners) to provide visual feedback to the user when data is being fetched from the API or when memes are being generated.

5. **UI/UX Polish and Responsiveness:**

   - [ ] **Refine UI Styling:** Improve the visual design and styling of your application to make it more polished and professional. Focus on consistency, readability, and visual appeal.
   - [ ] **Improve User Experience:** Review the user flow and identify areas for improvement. Make the application more intuitive and user-friendly.
   - [ ] **Basic Responsiveness:** Ensure that your application is reasonably responsive and works well on different screen sizes (at least basic responsiveness for desktop and tablet).

6. **Thorough Testing and Bug Fixing:**
   - [ ] **Comprehensive Testing:** Perform thorough testing of all features, including the Comparison Feature, Reality Check features, data visualizations, error handling, and UI polish.
   - [ ] **Cross-Browser Testing:** Test your application in multiple browsers (Chrome, Firefox, Safari, Edge) to ensure cross-browser compatibility.
   - [ ] **Bug Fixing:** Identify and fix any bugs or issues found during testing.

**Phase 4 Deliverables:**

- [ ] Comparison Feature ("Bitcoin vs. iPhone") implemented and functional.
- [ ] Reality Check Features (Risk Disclaimer) implemented.
- [ ] Basic data visualizations (line chart) integrated into the UI.
- [ ] Improved error handling and user feedback implemented.
- [ ] UI/UX polish and basic responsiveness improved.
- [ ] Thorough testing and bug fixing completed.
- [ ] Code committed to Git repository.

---

## Phase 5: Documentation, Deployment & Portfolio Prep (1 week)

**Goal:** Document your project, deploy it online (optional but highly recommended), and prepare your project description for your resume and portfolio.

**Tasks:**

1. **Project Documentation:**

   - [ ] **README.md File:** Create a comprehensive `README.md` file in your project repository:
     - **Project Title and Description:** Clearly describe your project and its purpose.
     - **Features:** List the key features of your application.
     - **Technology Stack:** List all technologies used (Spring Boot, React/Vue.js, APIs, database, etc.).
     - **Setup Instructions:** Provide clear instructions on how to run the project locally (for both backend and frontend).
     - **Deployment Instructions (Optional but helpful if deployed):** If you deploy your app, include instructions on accessing the live demo.
     - **Future Enhancements (Optional):** You can mention potential future enhancements you considered (from `plan.md`).
     - **Credits/Attributions (if any):** Give credit to any libraries, APIs, or resources you used.
   - [ ] **API Documentation (Optional, but good practice):** If you have complex API endpoints, consider creating basic API documentation using tools like Swagger/OpenAPI or simply documenting your API endpoints in the `README.md`.

2. **Deployment (Optional but Highly Recommended):**

   - [ ] **Choose a Deployment Platform:**
     - **Frontend:** Netlify, Vercel, GitHub Pages (for static frontend builds).
     - **Backend (Spring Boot):** Heroku (easiest for Spring Boot), AWS Elastic Beanstalk, Google Cloud App Engine, etc. (Heroku is recommended for simplicity for a fresher project).
   - [ ] **Deploy Frontend:** Build your frontend project for production and deploy it to your chosen frontend platform.
   - [ ] **Deploy Backend:** Package your Spring Boot backend application (e.g., as a JAR file) and deploy it to your chosen backend platform.
   - [ ] **Configure Frontend to Connect to Deployed Backend:** Update your frontend API service to point to the URL of your deployed backend API.
   - [ ] **Test Deployed Application:** Thoroughly test your deployed application to ensure everything is working correctly in the live environment.

3. **Resume and Portfolio Preparation:**
   - [ ] **Project Description for Resume:** Write a concise and compelling project description for your resume. Highlight the key features, technologies used, and your contributions. Focus on the value proposition and engaging aspects of the project.
   - [ ] **Portfolio Website (Optional but Recommended):** If you have a personal portfolio website, add your "Investment FOMO Time Machine" project to your portfolio.
     - Include screenshots or a short demo video of your application.
     - Link to your GitHub repository and (if deployed) a live demo link.
   - [ ] **Record a Short Demo Video (Optional but Highly Recommended):** Record a short (1-2 minute) demo video showcasing the key features and functionality of your application. This can significantly enhance your portfolio presentation.

**Phase 5 Deliverables:**

- [ ] Comprehensive project documentation (README.md).
- [ ] (Optional) API documentation.
- [ ] (Optional but Highly Recommended) Deployed application accessible online.
- [ ] Project description prepared for resume and portfolio.
- [ ] (Optional but Highly Recommended) Short demo video recorded.
- [ ] Final code committed to Git repository.

---

This phase-by-phase plan should give you a more detailed and actionable roadmap to follow as you build your "Investment FOMO Time Machine & Regret Calculator" project. Remember to be flexible, adjust the plan as needed, and focus on learning and building a quality project that you can be proud to showcase in your portfolio! Good luck!
