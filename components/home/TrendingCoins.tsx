import Image from "next/image";
import Link from "next/link";
import { TrendingDown, TrendingUp } from "lucide-react";

import DataTable from "@/components/DataTable";
import { fetcher } from "@/lib/coingecko.actions";
import { cn } from "@/lib/utils";

const MAX_COINS_COUNT = 6;

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

  const columns: DataTableColumn<TrendingCoin>[] = [
    {
      header: "Name",
      cellClassName: "name-cell",
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
      header: "24h Change",
      cellClassName: "name-cell",
      cell: ({ item }) => {
        const priceChangePercentage24hUSD = item.data.price_change_percentage_24h.usd;
        const isTrendingUp = priceChangePercentage24hUSD > 0;
        const TrendingIcon = isTrendingUp ? TrendingUp : TrendingDown;
        return (
          <div className={cn("price-change", isTrendingUp ? "text-green-500" : "text-red-500")}>
            <p>
              <TrendingIcon width={16} height={16} />
              {Math.abs(priceChangePercentage24hUSD).toFixed(2)}%
            </p>
          </div>
        );
      },
    },
    {
      header: "Price",
      cellClassName: "price-cell",
      cell: ({ item }) => "$" + item.data.price.toLocaleString(),
    },
  ];

  return (
    <div id="trending-coins">
      <h4>Trending Coins</h4>
      <DataTable
        data={trendingCoins.coins.slice(0, MAX_COINS_COUNT) || []}
        columns={columns}
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
            header: "Name",
            cell: () => (
              <div className="name-link">
                <div className="name-image skeleton" />
                <div className="name-line skeleton" />
              </div>
            ),
          },
          {
            header: "24h Change",
            cell: () => (
              <div className="price-change flex flex-col items-start">
                <div className="change-icon skeleton" />
                <div className="change-line skeleton" />
              </div>
            ),
          },
          {
            header: "Price",
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
