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
import { Calculator, LogOut } from "lucide-react";
import { supabase } from "./lib/supabase";

function Dashboard() {
  const [selectedAsset, setSelectedAsset] = useState("");
  const [entryDate, setEntryDate] = useState<Date | null>(null);
  const [exitDate, setExitDate] = useState<Date | null>(null);
  const [amount, setAmount] = useState("");
  const [results, setResults] = useState<InvestmentResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

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
    if (!amount || parseFloat(amount) <= 0) {
      if (parseFloat(amount) === 0) {
        setError("Bold strategy, let's see how it plays out 🧐");
      } else {
        setError("Please enter a valid investment amount");
      }
      return;
    }

    setLoading(true);
    try {
      const result = await fetchInvestmentData({
        assetSymbol: selectedAsset,
        entryDate,
        exitDate,
        investmentAmount: parseFloat(amount),
      });

      setResults(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex-shrink-0 flex items-center">
              <Link to="/" className="text-xl font-bold text-gray-900">
                Investment Calculator
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              <Link
                to="/compare-assets"
                className="text-gray-500 hover:text-gray-700"
              >
                Compare Assets
              </Link>
              <Link to="/profile" className="text-gray-500 hover:text-gray-700">
                Profile
              </Link>
              <button
                onClick={handleSignOut}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-gray-500 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
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
          <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl">
            Calculate Investment Returns
          </h1>
          <p className="mt-3 text-xl text-gray-500">
            See how your investment would have performed over time
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
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

            {error && <div className="text-red-500 text-sm mt-2">{error}</div>}

            <button
              onClick={handleCalculate}
              disabled={loading}
              className="w-full flex items-center justify-center px-4 py-2 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span>Calculating...</span>
              ) : (
                <>
                  <Calculator className="w-5 w-5 mr-2" />
                  Calculate Returns
                </>
              )}
            </button>
          </div>
        </div>

        {results && <ResultsDisplay results={results} />}
        <footer className="text-center text-gray-500 mt-4 text-xs">
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
