import React, { useState } from "react";
import { Link } from "react-router-dom";
import { AssetDropdown } from "../components/AssetDropdown";
import { DateRangePicker } from "../components/DateRangePicker";
import { AmountInput } from "../components/AmountInput";
import { ResultsDisplay } from "../components/ResultsDisplay";
import { fetchInvestmentData, type InvestmentResult } from "../services/api";
import { Calculator, ArrowLeft } from "lucide-react";

export const CompareAssets = () => {
  const [asset1, setAsset1] = useState("");
  const [asset2, setAsset2] = useState("");
  const [entryDate, setEntryDate] = useState<Date | null>(null);
  const [exitDate, setExitDate] = useState<Date | null>(null);
  const [amount, setAmount] = useState("");
  const [asset1Results, setAsset1Results] = useState<InvestmentResult | null>(
    null
  );
  const [asset2Results, setAsset2Results] = useState<InvestmentResult | null>(
    null
  );
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleCalculate = async () => {
    setError(null);

    if (!asset1 || !asset2) {
      setError("Please select both assets to compare");
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
      const [asset1Data, asset2Data] = await Promise.all([
        fetchInvestmentData({
          assetSymbol: asset1,
          entryDate,
          exitDate,
          investmentAmount: parseFloat(amount),
        }),
        fetchInvestmentData({
          assetSymbol: asset2,
          entryDate,
          exitDate,
          investmentAmount: parseFloat(amount),
        }),
      ]);

      setAsset1Results(asset1Data);
      setAsset2Results(asset2Data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-warm-gray-light">
      <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <Link
          to="/"
          className="inline-flex items-center px-4 py-2 mb-6 text-sm font-medium rounded-md text-charcoal hover:text-charcoal-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-accent"
        >
          <ArrowLeft className="h-5 w-5 mr-2" />
          Back to Dashboard
        </Link>
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-charcoal-dark sm:text-4xl">
            Compare Assets
          </h1>
          <p className="mt-3 text-xl text-charcoal">
            Side-by-side comparison of two assets' historical performance
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-charcoal mb-1">
                  Asset 1
                </label>
                <AssetDropdown
                  selectedAsset={asset1}
                  onAssetChange={setAsset1}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-charcoal mb-1">
                  Asset 2
                </label>
                <AssetDropdown
                  selectedAsset={asset2}
                  onAssetChange={setAsset2}
                />
              </div>
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

        {(asset1Results || asset2Results) && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {asset1Results && (
              <ResultsDisplay
                results={asset1Results}
                assetSymbol={asset1}
                amount={amount}
                entryDate={entryDate || undefined}
                exitDate={exitDate || undefined}
              />
            )}
            {asset2Results && (
              <ResultsDisplay
                results={asset2Results}
                assetSymbol={asset2}
                amount={amount}
                entryDate={entryDate || undefined}
                exitDate={exitDate || undefined}
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default CompareAssets;
