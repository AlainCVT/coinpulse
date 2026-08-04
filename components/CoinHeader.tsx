import Image from "next/image";
import { TrendingDown, TrendingUp } from "lucide-react";

import { cn, formatCurrency, formatPercentage } from "@/lib/utils";

import { Badge } from "./ui/badge";

const CoinHeader = ({
  livePriceChangePercentage24h,
  priceChangePercentage30d,
  name,
  image,
  livePrice,
  priceChange24h,
}: LiveCoinHeaderProps) => {
  const isTrendingUp = livePriceChangePercentage24h > 0;
  const isTrendingDown = livePriceChangePercentage24h < 0;

  const STATS: CoinStats[] = [
    {
      label: "Today",
      value: livePriceChangePercentage24h,
      formatter: formatPercentage,
      showIcon: true,
    },
    {
      label: "30 Days",
      value: priceChangePercentage30d,
      formatter: formatPercentage,
      showIcon: true,
    },
    {
      label: "Price Change (24h)",
      value: priceChange24h,
      formatter: formatCurrency,
      showIcon: false,
    },
  ].map((stats) => ({
    ...stats,
    isUp: stats.value > 0,
    isDown: stats.value < 0,
  }));

  return (
    <div id="coin-header">
      <h3>{name}</h3>
      <div className="info">
        <Image src={image} alt={name} width={77} height={77} />
        <div className="price-row">
          <h1>{formatCurrency(livePrice)}</h1>
          <Badge
            className={cn("badge", {
              "badge-middle": !isTrendingUp && !isTrendingDown,
              "badge-up": isTrendingUp,
              "badge-down": isTrendingDown,
            })}
          >
            {formatPercentage(livePriceChangePercentage24h)}
            {isTrendingUp && <TrendingUp />}
            {isTrendingDown && <TrendingDown />}
            (24h)
          </Badge>
        </div>
      </div>
      <ul className="stats">
        {STATS.map((stat, index) => (
          <li key={`stat-${index}`}>
            <p className="label">{stat.label}</p>
            <div
              className={cn("value", {
                "text-gray-500": !stat.isUp && !stat.isDown,
                "text-green-500": stat.isUp,
                "text-red-500": stat.isDown,
              })}
            >
              <p>{stat.formatter(stat.value)}</p>
              {stat.showIcon && (
                <>
                  {stat.isUp && <TrendingUp width={16} height={16} />}
                  {stat.isDown && <TrendingDown width={16} height={16} />}
                </>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CoinHeader;
