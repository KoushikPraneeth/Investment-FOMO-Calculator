import React, { useState } from "react";
import { Link } from "react-router-dom";
import { BattleRoyaleSelector } from "../components/BattleRoyaleSelector";
import { DateRangePicker } from "../components/DateRangePicker";
import { AmountInput } from "../components/AmountInput";
import { RacingBarChart } from "../components/RacingBarChart";
import { BattleCommentary } from "../components/BattleCommentary";
import { fetchInvestmentData, type InvestmentResult } from "../services/api";
import { Swords, ArrowLeft } from "lucide-react";

export const AssetBattleRoyale = () => {
  const [assets, setAssets] = useState(["", "", ""]);
  const [entryDate, setEntryDate] = useState<Date | null>(null);
  const [exitDate, setExitDate] = useState<Date | null>(null);
  const [amount, setAmount] = useState("");
  const [assetResults, setAssetResults] = useState<InvestmentResult[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleCalculate = async () => {
    setError(null);

    if (assets.some((asset) => !asset)) {
      setError("Please select all assets to compare");
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
      const investmentDataPromises = assets.map((assetSymbol) =>
        fetchInvestmentData({
          assetSymbol,
          entryDate,
          exitDate,
          investmentAmount: parseFloat(amount),
        })
      );

      const results = await Promise.all(investmentDataPromises);
      setAssetResults(results);
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
            Asset Battle Royale 🏆
          </h1>
          <p className="mt-3 text-xl text-charcoal">
            Three assets enter, one emerges victorious!
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <div className="space-y-6">
            <BattleRoyaleSelector assets={assets} setAssets={setAssets} />

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
                <span>Commencing Battle...</span>
              ) : (
                <>
                  <Swords className="w-5 h-5 mr-2" />
                  Start Battle!
                </>
              )}
            </button>
          </div>
        </div>

        {assetResults.length > 0 && (
          <div className="space-y-6">
            <RacingBarChart assetResults={assetResults} />
            <BattleCommentary assetResults={assetResults} />
          </div>
        )}
      </div>
    </div>
  );
};

export default AssetBattleRoyale;
