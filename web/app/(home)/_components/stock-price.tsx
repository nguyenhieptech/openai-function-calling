import { stockPricesAtom } from '@/store';
import { useAtom } from 'jotai';
import Image from 'next/image';
import React from 'react';

export function StockPrices() {
  const [stockPrices] = useAtom(stockPricesAtom);

  console.log('stockPrices', stockPrices);
  // TODO: Make prettier and show logos

  return (
    <div className="flex w-full flex-col p-4">
      <h1 className="mb-6 text-4xl font-semibold text-gray-800">Stock Prices</h1>
      <div className="divide-y divide-gray-200">
        {stockPrices.map((stockPrice) => (
          <div
            className="flex flex-row items-center justify-between py-2"
            key={stockPrice.symbol}
          >
            <div className="flex items-center space-x-3">
              {stockPrice.logoURL && (
                <Image
                  src={stockPrice.logoURL}
                  alt={`${stockPrice.symbol} logo`}
                  className="h-10 w-10 object-contain"
                />
              )}
              <span className="text-lg font-medium text-gray-600">
                {stockPrice.symbol}
              </span>
            </div>
            <span className="text-lg font-medium text-green-600">
              ${stockPrice.price.toFixed(2)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
