import React, { useState, MouseEvent, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { Login } from "./pages/Login";
import { Signup } from "./pages/Signup";
import Profile from "./pages/Profile";
import AssetBattleRoyale from "./pages/AssetBattleRoyale";
import { AuthGuard } from "./components/AuthGuard";
import { AssetDropdown } from "./components/AssetDropdown";
import { DateRangePicker } from "./components/DateRangePicker";
import { AmountInput } from "./components/AmountInput";
import { ResultsDisplay } from "./components/ResultsDisplay";
import { fetchInvestmentData, generateScenarioData, type InvestmentResult, type ScenarioResult } from "./services/api";
import {
  Calculator,
  LogOut,
  Coffee,
  Coins,
  ChevronDown,
  DollarSign,
  BarChart2,
} from "lucide-react";
import { RangeSlider } from "./components/RangeSlider";
import { DarkModeToggle } from "./components/DarkModeToggle";
import { supabase } from "./lib/supabase";
import { ScenarioSelector, type Scenario } from "./components/ScenarioSelector";
import { AdvancedMetrics } from "./components/AdvancedMetrics";
import { InvestmentChart } from "./components/InvestmentChart";

function Dashboard() {
  const [selectedAsset, setSelectedAsset] = useState("");
  const [entryDate, setEntryDate] = useState<Date | null>(null);
  const [exitDate, setExitDate] = useState<Date | null>(null);
  const [amount, setAmount] = useState("");
  const [results, setResults] = useState<InvestmentResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [selectedScenario, setSelectedScenario] = useState<Scenario | null>(null);
  const [comparisonResult, setComparisonResult] = useState<ScenarioResult | null>(null);
  const [showAdvancedMetrics, setShowAdvancedMetrics] = useState(false);

  // What-If Scenarios states
  const [lattesPerWeek, setLattesPerWeek] = useState(0);
  const [medicalProcedures, setMedicalProcedures] = useState(0);
  const LATTE_PRICE = 5; // $5 per latte
  const MEDICAL_VALUE = 10000; // $10,000 per "procedure"

  const handleSignOut = async () => {
    await supabase.auth.signOut();
  };

  const handleCalculate = async (e?: MouseEvent<HTMLButtonElement>) => {
    setError(null);
    setComparisonResult(null);
    setSelectedScenario(null);

    if (!selectedAsset) {
      setError("Please select an asset");
      return;
    }
    if (!entryDate) {
      setError("Please select an entry date");
      return;
    }
    if (!exitDate) {
      setError("Please select an exit date");
      return;
    }

    // Calculate additional investment from What-If scenarios
    const latteSavings = lattesPerWeek * LATTE_PRICE * 52; // Weekly savings * 52 weeks
    const medicalValue = medicalProcedures * MEDICAL_VALUE;
    const totalAmount = parseFloat(amount || "0") + latteSavings + medicalValue;

    if (!amount && !latteSavings && !medicalValue) {
      setError(
        "Please enter an investment amount or try our What-If scenarios"
      );
      return;
    }
    if (totalAmount <= 0) {
      setError("Bold strategy, let's see how it plays out 🧐");
      return;
    }

    setLoading(true);
    try {
      const result = await fetchInvestmentData({
        assetSymbol: selectedAsset,
        entryDate,
        exitDate,
        investmentAmount: totalAmount,
      });

      setResults(result);
      setShowAdvancedMetrics(false); // Reset advanced metrics visibility
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };
  
  // Handle scenario selection
  const handleScenarioSelect = (scenario: Scenario | null) => {
    setSelectedScenario(scenario);
    
    if (scenario && results) {
      // Generate comparison data based on the selected scenario
      const scenarioData = generateScenarioData(
        results,
        scenario.multiplier,
        scenario.name
      );
      setComparisonResult(scenarioData);
    } else {
      setComparisonResult(null);
    }
  };
  
  // Toggle advanced metrics visibility
  const toggleAdvancedMetrics = () => {
    setShowAdvancedMetrics(prev => !prev);
  };

  return (
    <div className="min-h-screen bg-warm-gray-light dark:bg-dark-bg-primary transition-colors duration-300">
      <nav className="bg-white dark:bg-dark-bg-secondary shadow-sm sticky top-0 z-10 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex-shrink-0 flex items-center">
              <Link to="/" className="text-lg sm:text-xl font-bold text-charcoal-dark dark:text-dark-text-primary">
                Investment Calculator
              </Link>
            </div>
            <div className="flex items-center space-x-2 sm:space-x-4">
              <DarkModeToggle />
              <Link
                to="/asset-battle-royale"
                className="hidden sm:inline-block text-charcoal hover:text-charcoal-dark dark:text-dark-text-secondary dark:hover:text-dark-text-primary"
              >
                Asset Battle Royale
              </Link>
              <Link
                to="/profile"
                className="text-charcoal hover:text-charcoal-dark dark:text-dark-text-secondary dark:hover:text-dark-text-primary"
              >
                Profile
              </Link>
              <button
                onClick={handleSignOut}
                className="inline-flex items-center px-2 sm:px-4 py-2 border border-transparent dark:border-dark-bg-tertiary text-sm font-medium rounded-md text-charcoal hover:text-charcoal-dark dark:text-dark-text-secondary dark:hover:text-dark-text-primary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-accent dark:focus:ring-offset-dark-bg-primary"
              >
                <LogOut className="h-5 w-5 sm:mr-2" />
                <span className="hidden sm:inline">Sign out</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto py-6 sm:py-12 px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-charcoal-dark dark:text-dark-text-primary">
            Calculate Investment Returns
          </h1>
          <p className="mt-2 sm:mt-3 text-lg sm:text-xl text-charcoal dark:text-dark-text-secondary">
            See how your investment would have performed over time
          </p>
        </div>

        <div className="bg-white dark:bg-dark-bg-secondary rounded-lg shadow-lg p-6 mb-8 transition-colors duration-300">
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-charcoal mb-1">
                Select Asset
              </label>
              <AssetDropdown
                selectedAsset={selectedAsset}
                onAssetChange={(asset: string) => {
                  setSelectedAsset(asset);
                  setResults(null);
                }}
              />
            </div>

            <DateRangePicker
              entryDate={entryDate}
              exitDate={exitDate}
              onEntryDateChange={setEntryDate}
              onExitDateChange={setExitDate}
            />

            <AmountInput amount={amount} onAmountChange={setAmount} />

            <details className="mt-4">
              <summary className="flex items-center cursor-pointer select-none">
                <ChevronDown className="h-5 w-5 text-charcoal dark:text-dark-text-primary mr-2 transform transition-transform duration-200 details-toggle" />
                <span className="font-semibold text-charcoal dark:text-dark-text-primary">
                  Explore 'What-If' Scenarios{" "}
                  <span className="text-sm text-charcoal-light dark:text-dark-text-secondary">
                    (Optional)
                  </span>
                </span>
              </summary>
              <div className="mt-4 p-4 bg-warm-gray-lighter dark:bg-dark-bg-tertiary rounded-md space-y-6 transition-colors duration-300">
                {/* Latte Scenario */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Coffee className="h-5 w-5 text-charcoal dark:text-dark-text-primary mr-2" />
                      <label
                        htmlFor="lattes-slider"
                        className="text-sm font-medium text-charcoal dark:text-dark-text-primary"
                      >
                        Lattes Skipped per Week
                      </label>
                    </div>
                    <span className="text-sm text-charcoal dark:text-dark-text-secondary">
                      ${(lattesPerWeek * LATTE_PRICE * 52).toLocaleString()} /
                      year
                    </span>
                  </div>
                  <RangeSlider
                    id="lattes-slider"
                    min={0}
                    max={20}
                    value={lattesPerWeek}
                    onChange={setLattesPerWeek}
                  />
                  <div className="text-xs text-charcoal-light dark:text-dark-text-secondary mt-1">
                    Current: {lattesPerWeek} lattes/week (${LATTE_PRICE} each)
                  </div>
                </div>

                {/* Medical Procedures Scenario */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Coins className="h-5 w-5 text-charcoal dark:text-dark-text-primary mr-2" />
                      <label
                        htmlFor="medical-slider"
                        className="text-sm font-medium text-charcoal dark:text-dark-text-primary"
                      >
                        Missed Tesla for Medical Co-pay 😉
                      </label>
                    </div>
                    <span className="text-sm text-charcoal dark:text-dark-text-secondary">
                      ${(medicalProcedures * MEDICAL_VALUE).toLocaleString()}
                    </span>
                  </div>
                  <RangeSlider
                    id="medical-slider"
                    min={0}
                    max={2}
                    value={medicalProcedures}
                    onChange={setMedicalProcedures}
                  />
                  <div className="text-xs text-charcoal-light dark:text-dark-text-secondary mt-1 flex justify-between">
                    <span>Current: {medicalProcedures} co-pays</span>
                    <span className="italic">
                      (Could've been Tesla shares...)
                    </span>
                  </div>
                </div>

                {(lattesPerWeek > 0 || medicalProcedures > 0) && (
                  <div className="border-t border-warm-gray dark:border-dark-bg-tertiary pt-4 mt-4">
                    <div className="text-sm font-medium text-charcoal dark:text-dark-text-primary flex items-center justify-between">
                      <span className="flex items-center">
                        <DollarSign className="h-4 w-4 text-teal-accent dark:text-dark-text-accent mr-1" />
                        Additional Investment:
                      </span>
                      $
                      {(
                        lattesPerWeek * LATTE_PRICE * 52 +
                        medicalProcedures * MEDICAL_VALUE
                      ).toLocaleString()}
                    </div>
                  </div>
                )}
              </div>
            </details>

            {error && <div className="text-red-500 text-sm mt-2">{error}</div>}

            <button
              onClick={handleCalculate}
              disabled={loading}
              className="w-full flex items-center justify-center px-4 py-3 sm:py-2 border border-transparent text-base font-medium rounded-md text-white bg-teal-accent hover:bg-teal-accent-darker dark:bg-teal-accent-darker dark:hover:bg-teal-accent focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-accent dark:focus:ring-offset-dark-bg-secondary disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 animate-fade-in"
            >
              {loading ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Calculating...
                </span>
              ) : (
                <>
                  <Calculator className="w-5 h-5 mr-2" />
                  Calculate Returns
                </>
              )}
            </button>
          </div>
        </div>

        {results && (
          <>
            <ResultsDisplay
              results={results}
              assetSymbol={selectedAsset}
              amount={amount}
              entryDate={entryDate || undefined}
              exitDate={exitDate || undefined}
            />
            
            {/* Advanced Metrics Toggle */}
            <div className="mt-6">
              <button
                onClick={toggleAdvancedMetrics}
                className="flex items-center justify-center w-full py-2 px-4 bg-warm-gray-lighter dark:bg-dark-bg-tertiary text-charcoal-dark dark:text-dark-text-primary rounded-lg hover:bg-warm-gray dark:hover:bg-dark-bg-primary transition-colors duration-200"
              >
                <BarChart2 className="w-5 h-5 mr-2 text-teal-accent dark:text-dark-text-accent" />
                {showAdvancedMetrics ? 'Hide Advanced Metrics' : 'Show Advanced Metrics'}
              </button>
            </div>
            
            {/* Advanced Metrics */}
            {showAdvancedMetrics && (
              <AdvancedMetrics 
                results={results} 
                comparisonName={comparisonResult?.name}
                comparisonReturn={comparisonResult?.profitLossPercentage}
              />
            )}
            
            {/* Scenario Selector */}
            <ScenarioSelector 
              onScenarioSelect={handleScenarioSelect}
              selectedScenarioId={selectedScenario?.id || null}
            />
            
            {/* Comparison Chart */}
            {comparisonResult && (
              <div className="mt-6 bg-white dark:bg-dark-bg-secondary rounded-lg shadow-lg p-6 transition-colors duration-300">
                <h3 className="text-lg font-semibold mb-4 text-charcoal-dark dark:text-dark-text-primary">
                  Performance Comparison: {results.assetName} vs. {comparisonResult.name}
                </h3>
                <div className="mb-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                    <div className="p-4 bg-warm-gray-lighter dark:bg-dark-bg-tertiary rounded-lg transition-colors duration-300">
                      <h4 className="text-sm font-medium text-charcoal-dark dark:text-dark-text-secondary mb-1">{results.assetName}</h4>
                      <p className={`text-lg font-semibold ${results.profitLoss >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                        {results.profitLossPercentage.toFixed(2)}%
                      </p>
                    </div>
                    <div className="p-4 bg-warm-gray-lighter dark:bg-dark-bg-tertiary rounded-lg transition-colors duration-300">
                      <h4 className="text-sm font-medium text-charcoal-dark dark:text-dark-text-secondary mb-1">{comparisonResult.name}</h4>
                      <p className={`text-lg font-semibold ${comparisonResult.profitLoss >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                        {comparisonResult.profitLossPercentage.toFixed(2)}%
                      </p>
                    </div>
                  </div>
                </div>
                
                {/* Comparison Chart */}
                <div className="mt-4">
                  <InvestmentChart 
                    mainData={results.historicalPrices}
                    mainLabel={results.assetName}
                    comparisonData={comparisonResult.historicalPrices}
                    comparisonLabel={comparisonResult.name}
                    chartType="area"
                    showInvestmentPoints={true}
                  />
                </div>
              </div>
            )}
          </>
        )}
        <footer className="text-center text-charcoal-light dark:text-dark-text-secondary mt-6 sm:mt-4 text-xs px-2 sm:px-0">
          Not financial advice. We're just here to make you cry over
          hypotheticals. Consult a therapist (or a cat) before making real
          investments.
        </footer>
      </div>
    </div>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route
          path="/asset-battle-royale"
          element={
            <AuthGuard>
              <AssetBattleRoyale />
            </AuthGuard>
          }
        />
        <Route
          path="/profile"
          element={
            <AuthGuard>
              <Profile />
            </AuthGuard>
          }
        />
        <Route
          path="/"
          element={
            <AuthGuard>
              <Dashboard />
            </AuthGuard>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
