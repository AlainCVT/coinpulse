import Image from "next/image";
import Link from "next/link";
import { TrendingDown, TrendingUp } from "lucide-react";

import DataTable from "@/components/DataTable";
import { fetcher } from "@/lib/coingecko.actions";
import { cn, formatPercentage } from "@/lib/utils";

const MAX_COINS_COUNT = 6;

const TRENDING_COINS_COLUMNS_BASE = {
  name: {
    header: "Name",
    cellClassName: "name-cell",
  },
  change: {
    header: "24h Change",
    headClassName: "w-1/5",
    cellClassName: "change-cell",
  },
  price: {
    header: "Price",
    headClassName: "w-1/5",
    cellClassName: "price-cell",
  },
} satisfies Record<string, DataTableColumnBase>;

const TrendingCoins = async () => {
  const trendingCoins = await fetcher<{
    coins: TrendingCoin[];
  }>("/search/trending", {}, 300).catch(
    (error) =>
      new Error(
        `Error fetching trending coins: ${error instanceof Error ? error.toString() : JSON.stringify(error)}`,
      ),
  );

  if (trendingCoins instanceof Error) {
    console.error(trendingCoins.message);
    return <TrendingCoinsFallback />;
  }

  const TRENDING_COINS_COLUMNS: DataTableColumn<TrendingCoin>[] = [
    {
      ...TRENDING_COINS_COLUMNS_BASE.name,
      cell: ({ item }) => {
        return (
          <Link href={`/coins/${item.id}`} className="flex items-center gap-2">
            <Image
              src={item.large}
              alt={item.name}
              width={36}
              height={36}
              className="size-9 object-contain"
            />
            <p>{item.name}</p>
          </Link>
        );
      },
    },
    {
      ...TRENDING_COINS_COLUMNS_BASE.change,
      cell: ({ item }) => {
        const change = item.data.price_change_percentage_24h.usd;
        const isTrendingUp = change > 0;
        const isTrendingDown = change < 0;
        return (
          <div
            className={cn("price-change", {
              "text-gray-500": change === 0,
              "text-green-500": isTrendingUp,
              "text-red-500": isTrendingDown,
            })}
          >
            <p className="flex items-center gap-1">
              {isTrendingUp && "+"}
              {formatPercentage(change)}
              {isTrendingUp && <TrendingUp width={16} height={16} />}
              {isTrendingDown && <TrendingDown width={16} height={16} />}
            </p>
          </div>
        );
      },
    },
    {
      ...TRENDING_COINS_COLUMNS_BASE.price,
      cell: ({ item }) => "$" + item.data.price.toLocaleString(),
    },
  ];

  return (
    <div id="trending-coins">
      <h4>Trending Coins</h4>
      <DataTable
        data={trendingCoins.coins.slice(0, MAX_COINS_COUNT) || []}
        columns={TRENDING_COINS_COLUMNS}
        rowKey={(coin) => coin.item.id}
        tableClassName="trending-coins-table"
        headerCellClassName="py-3!"
      />
    </div>
  );
};

export const TrendingCoinsFallback = () => {
  return (
    <div id="trending-coins-fallback">
      <h4>Trending Coins</h4>
      <DataTable
        data={Array.from({ length: MAX_COINS_COUNT }, (_, i) => ({ id: i }))}
        columns={[
          {
            ...TRENDING_COINS_COLUMNS_BASE.name,
            cell: () => (
              <div className="name-link">
                <div className="name-image skeleton" />
                <div className="name-line skeleton" />
              </div>
            ),
          },
          {
            ...TRENDING_COINS_COLUMNS_BASE.change,
            cell: () => (
              <div className="price-change flex flex-col items-start">
                <div className="change-icon skeleton" />
                <div className="change-line skeleton" />
              </div>
            ),
          },
          {
            ...TRENDING_COINS_COLUMNS_BASE.price,
            cell: () => <div className="price-line skeleton" />,
          },
        ]}
        rowKey={(item) => item.id}
        tableClassName="trending-coins-table"
        headerCellClassName="py-3!"
        bodyCellClassName="py-2!"
      />
    </div>
  );
};

export default TrendingCoins;
