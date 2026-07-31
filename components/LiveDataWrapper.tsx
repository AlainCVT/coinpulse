"use client";

import { useState } from "react";

import { useCoinGeckoWebSocket } from "@/hooks/useCoinGeckoWebSocket";
import { formatCurrency, timeAgo } from "@/lib/utils";

import CandlestickChart from "./CandlestickChart";
import { Separator } from "./ui/separator";
import DataTable from "./DataTable";

const TRADES_COLUMNS_BASE = {
  price: {
    header: "Price",
    cellClassName: "price-cell",
  },
  amount: {
    header: "Amount",
    cellClassName: "amount-cell",
  },
  value: {
    header: "Value",
    cellClassName: "value-cell",
  },
  type: {
    header: "Buy/Sell",
    cellClassName: "type-cell",
  },
  time: {
    header: "Time",
    cellClassName: "time-cell",
  },
} satisfies Record<string, DataTableColumnBase>;

const LiveDataWrapper = ({ children, coinId, poolId, coin, coinOHLCData }: LiveDataProps) => {
  const [liveInterval, setLiveInterval] = useState<Interval>("1s");

  const { trades, ohlcv } = useCoinGeckoWebSocket({ coinId, poolId, liveInterval });

  const TRADES_COLUMNS: DataTableColumn<Trade>[] = [
    {
      ...TRADES_COLUMNS_BASE.price,
      cell: (trade) => (trade.price ? formatCurrency(trade.price) : "-"),
    },
    {
      ...TRADES_COLUMNS_BASE.amount,
      cell: (trade) => trade.amount?.toFixed(4) ?? "-",
    },
    {
      ...TRADES_COLUMNS_BASE.value,
      cell: (trade) => (trade.value ? formatCurrency(trade.value) : "-"),
    },
    {
      ...TRADES_COLUMNS_BASE.type,
      cell: (trade) => (
        <span className={trade.type === "b" ? "text-green-500" : "text-red-500"}>
          {trade.type === "b" ? "Buy" : "Sell"}
        </span>
      ),
    },
    {
      ...TRADES_COLUMNS_BASE.time,
      cell: (trade) => (trade.timestamp ? timeAgo(trade.timestamp) : "-"),
    },
  ];

  return (
    <section id="live-data-wrapper">
      <p>Coin Header</p>
      <Separator className="divider" />
      <div className="trend">
        <CandlestickChart
          coinId={coinId}
          data={coinOHLCData}
          liveOhlcv={ohlcv}
          mode="live"
          initialPeriod="daily"
          liveInterval={liveInterval}
          setLiveInterval={setLiveInterval}
        >
          <h4>Trend Overview</h4>
        </CandlestickChart>
      </div>
      {!!trades.length && (
        <>
          <Separator className="divider" />
          <div className="trades">
            <h4>Recent Trades</h4>
            <DataTable
              columns={TRADES_COLUMNS}
              data={trades}
              rowKey={(_, index) => index}
              tableClassName="trades-table"
            />
          </div>
        </>
      )}
    </section>
  );
};

export default LiveDataWrapper;
