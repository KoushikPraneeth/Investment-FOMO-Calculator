import React, { useState, MouseEvent } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { Login } from "./pages/Login";
import { Signup } from "./pages/Signup";
import Profile from "./pages/Profile";
import CompareAssets from "./pages/CompareAssets";
import { AuthGuard } from "./components/AuthGuard";
import { AssetDropdown } from "./components/AssetDropdown";
import { DateRangePicker } from "./components/DateRangePicker";
import { AmountInput } from "./components/AmountInput";
import { ResultsDisplay } from "./components/ResultsDisplay";
import { fetchInvestmentData, type InvestmentResult } from "./services/api";
import {
  Calculator,
  LogOut,
  Coffee,
  Coins,
  ChevronDown,
  DollarSign,
} from "lucide-react";
import { RangeSlider } from "./components/RangeSlider";
import { supabase } from "./lib/supabase";

function Dashboard() {
  const [selectedAsset, setSelectedAsset] = useState("");
  const [entryDate, setEntryDate] = useState<Date | null>(null);
  const [exitDate, setExitDate] = useState<Date | null>(null);
  const [amount, setAmount] = useState("");
  const [results, setResults] = useState<InvestmentResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

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
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-warm-gray-light">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex-shrink-0 flex items-center">
              <Link to="/" className="text-xl font-bold text-charcoal-dark">
                Investment Calculator
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              <Link
                to="/compare-assets"
                className="text-charcoal hover:text-charcoal-dark"
              >
                Compare Assets
              </Link>
              <Link
                to="/profile"
                className="text-charcoal hover:text-charcoal-dark"
              >
                Profile
              </Link>
              <button
                onClick={handleSignOut}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-charcoal hover:text-charcoal-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-accent"
              >
                <LogOut className="h-5 w-5 mr-2" />
                Sign out
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-charcoal-dark sm:text-4xl">
            Calculate Investment Returns
          </h1>
          <p className="mt-3 text-xl text-charcoal">
            See how your investment would have performed over time
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
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
                <ChevronDown className="h-5 w-5 text-charcoal mr-2 transform transition-transform duration-200 details-toggle" />
                <span className="font-semibold text-charcoal">
                  Explore 'What-If' Scenarios{" "}
                  <span className="text-sm text-charcoal-light">
                    (Optional)
                  </span>
                </span>
              </summary>
              <div className="mt-4 p-4 bg-warm-gray-lighter rounded-md space-y-6">
                {/* Latte Scenario */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Coffee className="h-5 w-5 text-charcoal mr-2" />
                      <label
                        htmlFor="lattes-slider"
                        className="text-sm font-medium text-charcoal"
                      >
                        Lattes Skipped per Week
                      </label>
                    </div>
                    <span className="text-sm text-charcoal">
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
                  <div className="text-xs text-charcoal-light mt-1">
                    Current: {lattesPerWeek} lattes/week (${LATTE_PRICE} each)
                  </div>
                </div>

                {/* Medical Procedures Scenario */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Coins className="h-5 w-5 text-charcoal mr-2" />
                      <label
                        htmlFor="medical-slider"
                        className="text-sm font-medium text-charcoal"
                      >
                        Missed Tesla for Medical Co-pay 😉
                      </label>
                    </div>
                    <span className="text-sm text-charcoal">
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
                  <div className="text-xs text-charcoal-light mt-1 flex justify-between">
                    <span>Current: {medicalProcedures} co-pays</span>
                    <span className="italic">
                      (Could've been Tesla shares...)
                    </span>
                  </div>
                </div>

                {(lattesPerWeek > 0 || medicalProcedures > 0) && (
                  <div className="border-t border-warm-gray pt-4 mt-4">
                    <div className="text-sm font-medium text-charcoal flex items-center justify-between">
                      <span className="flex items-center">
                        <DollarSign className="h-4 w-4 text-teal-accent mr-1" />
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
              className="w-full flex items-center justify-center px-4 py-2 border border-transparent text-base font-medium rounded-md text-white bg-teal-accent hover:bg-teal-accent-darker focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-accent disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span>Calculating...</span>
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
          <ResultsDisplay 
            results={results}
            assetSymbol={selectedAsset}
            amount={amount}
            entryDate={entryDate || undefined}
            exitDate={exitDate || undefined}
          />
        )}
        <footer className="text-center text-charcoal-light mt-4 text-xs">
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
          path="/compare-assets"
          element={
            <AuthGuard>
              <CompareAssets />
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
