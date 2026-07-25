import Image from "next/image";
import Link from "next/link";
import { TrendingDown, TrendingUp } from "lucide-react";

import DataTable from "@/components/DataTable";
import { cn } from "@/lib/utils";

const dummyTrendingCoins: TrendingCoin[] = [
  {
    item: {
      id: "bitcoin",
      name: "Bitcoin",
      symbol: "BTC",
      market_cap_rank: 1,
      thumb: "/logo.svg",
      large: "/logo.svg",
      data: {
        price: 89113.0,
        price_change_percentage_24h: {
          usd: 2.5,
        },
      },
    },
  },
  {
    item: {
      id: "ethereum",
      name: "Ethereum",
      symbol: "ETH",
      market_cap_rank: 2,
      thumb: "/logo.svg",
      large: "/logo.svg",
      data: {
        price: 2500.0,
        price_change_percentage_24h: {
          usd: -1.2,
        },
      },
    },
  },
];

const columns: DataTableColumn<TrendingCoin>[] = [
  {
    header: "Name",
    cellClassName: "name-cell",
    cell: ({ item }) => {
      return (
        <Link href={`/coins/${item.id}`}>
          <Image src={item.large} alt={item.name} width={36} height={36} />
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

export default function Home() {
  return (
    <main className="main-container">
      <section className="home-grid">
        <div id="coin-overview">
          <div className="header pt-2">
            <Image
              src="https://assets.coingecko.com/coins/images/1/large/bitcoin.png"
              alt=""
              width={48}
              height={48}
            />
            <div className="info">
              <p>BitCoin / BTC</p>
              <h1>$89,130.00</h1>
            </div>
          </div>
        </div>
        <p>Trending Coins</p>
        <DataTable
          data={dummyTrendingCoins}
          columns={columns}
          rowKey={(coin) => coin.item.id}
          tableClassName="trending-coins-table"
        />
      </section>
      <section className="w-full mt-7 space-y-4">
        <p>Categories</p>
      </section>
    </main>
  );
}
