import Image from "next/image";

import { fetcher } from "@/lib/coingecko.actions";
import { formatCurrency } from "@/lib/utils";
import CandlestickChart from "@/components/CandlestickChart";

const CoinOverview = async () => {
  const [coin, coinOHLCData] = await Promise.all([
    fetcher<CoinDetailsData>("/coins/bitcoin", {
      dex_pair_format: "symbol",
    }).catch(
      (error) =>
        new Error(
          `Error fetching coin overview: ${error instanceof Error ? error.toString() : JSON.stringify(error)}`,
        ),
    ),
    fetcher<OHLCData[]>("/coins/bitcoin/ohlc", {
      vs_currency: "usd",
      days: 1,
      // interval: "hourly", // CoinGecko demo API now disallow the interval
      precision: "full",
    }).catch(
      (error) =>
        new Error(
          `Error fetching coin OHLC data: ${error instanceof Error ? error.toString() : JSON.stringify(error)}`,
        ),
    ),
  ]);

  if (coin instanceof Error) {
    console.error(coin.message);
    return <CoinOverviewFallback />;
  }

  if (coinOHLCData instanceof Error) {
    console.error(coinOHLCData.message);
    return <CoinOverviewFallback />;
  }

  return (
    <div id="coin-overview">
      <CandlestickChart data={coinOHLCData} coinId="bitcoin">
        <div className="header pt-2">
          <Image src={coin.image.large} alt={coin.name} width={250} height={250} />
          <div className="info">
            <p>
              {coin.name} / {coin.symbol.toUpperCase()}
            </p>
            <h1>{formatCurrency(coin.market_data.current_price.usd)}</h1>
          </div>
        </div>
      </CandlestickChart>
    </div>
  );
};

export const CoinOverviewFallback = () => {
  return (
    <div id="coin-overview-fallback">
      <div className="header pt-2">
        <div className="header-image skeleton" />
        <div className="info">
          <div className="header-line-sm skeleton" />
          <div className="header-line-lg skeleton" />
        </div>
      </div>
    </div>
  );
};

export default CoinOverview;
