'use client';

import { useState } from 'react';

export default function SwapTerminal() {
  const [fromAmount, setFromAmount] = useState('');
  const [toAmount, setToAmount] = useState('0.0');
  const [fromToken, setFromToken] = useState('BTC');
  const [toToken, setToToken] = useState('SOL');
  const [destination, setDestination] = useState('');

  const handleSwap = () => {
    if (!fromAmount || !destination) {
      alert("Please enter amount and destination address");
      return;
    }
    alert("Swap initiated! (Connect your swap logic here)");
  };

  return (
    <div className="swap-card w-full max-w-md mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold">Swap</h2>
        <div className="text-xs px-3 py-1 bg-zinc-800 text-emerald-400 rounded-full">
          5 routes compared
        </div>
      </div>

      {/* You Send */}
      <div className="mb-4">
        <div className="flex justify-between text-sm text-zinc-400 mb-2">
          <span>You send</span>
          <button 
            onClick={() => setFromAmount('1')}
            className="text-emerald-400 hover:text-emerald-300 text-xs font-medium"
          >
            MAX
          </button>
        </div>
        <div className="input-field flex items-center p-4">
          <input
            type="text"
            value={fromAmount}
            onChange={(e) => setFromAmount(e.target.value)}
            placeholder="0.0"
            className="flex-1 bg-transparent text-3xl outline-none placeholder:text-zinc-600"
          />
          <button className="token-button flex items-center gap-2 px-4 py-2 rounded-xl text-sm">
            {fromToken} <span className="text-zinc-400">↓</span>
          </button>
        </div>
      </div>

      {/* Arrow */}
      <div className="flex justify-center my-1">
        <div className="bg-zinc-800 p-2 rounded-full text-sm">↓</div>
      </div>

      {/* You Receive */}
      <div className="mb-6">
        <div className="flex justify-between text-sm text-zinc-400 mb-2">
          <span>You receive (estimated)</span>
          <span className="text-emerald-400 text-xs">Best rate</span>
        </div>
        <div className="input-field flex items-center p-4">
          <input
            type="text"
            value={toAmount}
            readOnly
            className="flex-1 bg-transparent text-3xl outline-none text-zinc-300"
          />
          <button className="token-button flex items-center gap-2 px-4 py-2 rounded-xl text-sm">
            {toToken} <span className="text-zinc-400">↓</span>
          </button>
        </div>
      </div>

      {/* Destination Address */}
      <div className="mb-6">
        <label className="block text-sm text-zinc-400 mb-2">Destination Address</label>
        <input
          type="text"
          value={destination}
          onChange={(e) => setDestination(e.target.value)}
          placeholder="Enter your wallet address"
          className="input-field w-full px-4 py-3 text-sm"
        />
      </div>

      {/* Info */}
      <div className="flex justify-between text-xs text-zinc-500 mb-6 px-1">
        <div>Est. time: 5–15 min</div>
        <div>Network fee included</div>
      </div>

      {/* Swap Button */}
      <button 
        onClick={handleSwap}
        className="cta-button w-full py-4 rounded-2xl text-lg"
      >
        Swap
      </button>

      <p className="text-center text-xs text-zinc-500 mt-4">
        Non-custodial • No account needed • Auto refund if swap fails
      </p>
    </div>
  );
}
