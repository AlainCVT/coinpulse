import Image from "next/image";
import { TrendingDown, TrendingUp } from "lucide-react";

import { fetcher } from "@/lib/coingecko.actions";
import { cn, formatCurrency, formatPercentage } from "@/lib/utils";
import DataTable from "@/components/DataTable";

const MAX_CATEGORIES_COUNT = 10;

const CATEGORIES_COLUMNS_BASE = {
  category: {
    header: "Category",
    cellClassName: "category-cell",
  },
  "top-gainers": {
    header: "Top Gainers",
    headClassName: "w-32",
    cellClassName: "top-gainers-cell",
  },
  change: {
    header: "24h Change",
    headClassName: "w-28",
    cellClassName: "change-header-cell",
  },
  "market-cap": {
    header: "Market Cap",
    headClassName: "w-1/5",
    cellClassName: "market-cap-cell",
  },
  volume: {
    header: "24h Volume",
    headClassName: "w-1/5",
    cellClassName: "volume-cell",
  },
} satisfies Record<string, DataTableColumnBase>;

const Categories = async () => {
  const categories = await fetcher<Category[]>("/coins/categories").catch(
    (error) =>
      new Error(
        `Error fetching categories: ${error instanceof Error ? error.toString() : JSON.stringify(error)}`,
      ),
  );

  const CATEGORIES_COLUMNS: DataTableColumn<Category>[] = [
    {
      ...CATEGORIES_COLUMNS_BASE.category,
      cell: (category) => category.name,
    },
    {
      ...CATEGORIES_COLUMNS_BASE["top-gainers"],
      cell: (category) =>
        category.top_3_coins.map((coin) => (
          <Image src={coin} alt={coin} key={coin} width={28} height={28} />
        )),
    },
    {
      ...CATEGORIES_COLUMNS_BASE.change,
      cell: (category) => {
        const isTrendingUp = category.market_cap_change_24h > 0;
        const TrendingIcon = isTrendingUp ? TrendingUp : TrendingDown;
        return (
          <div className={cn("change-cell", isTrendingUp ? "text-green-500" : "text-red-500")}>
            <p className="flex items-center gap-1">
              {formatPercentage(category.market_cap_change_24h)}
              <TrendingIcon width={16} height={16} />
            </p>
          </div>
        );
      },
    },
    {
      ...CATEGORIES_COLUMNS_BASE["market-cap"],
      cell: (category) => formatCurrency(category.market_cap),
    },
    {
      ...CATEGORIES_COLUMNS_BASE.volume,
      cell: (category) => formatCurrency(category.volume_24h),
    },
  ];

  if (categories instanceof Error) {
    console.error(categories.message);
    return <CategoriesFallback />;
  }

  return (
    <div id="categories" className="custom-scrollbar">
      <h4>Top Categories</h4>
      <DataTable
        columns={CATEGORIES_COLUMNS}
        data={categories.slice(0, MAX_CATEGORIES_COUNT) || []}
        rowKey={(_, index) => index}
        tableClassName="mt-3"
      />
    </div>
  );
};

export const CategoriesFallback = () => {
  return (
    <div id="categories-fallback">
      <h4>Trending Coins</h4>
      <DataTable
        data={Array.from({ length: MAX_CATEGORIES_COUNT }, (_, i) => ({ id: i }))}
        columns={[
          {
            ...CATEGORIES_COLUMNS_BASE.category,
            cell: () => <div className="category-skeleton skeleton" />,
          },
          {
            ...CATEGORIES_COLUMNS_BASE["top-gainers"],
            cell: () => (
              <div className="flex gap-1">
                <div className="coin-skeleton skeleton" />
                <div className="coin-skeleton skeleton" />
                <div className="coin-skeleton skeleton" />
              </div>
            ),
          },
          {
            ...CATEGORIES_COLUMNS_BASE.change,
            cell: () => (
              <div className="change-cell">
                <div className="change-icon skeleton" />
                <div className="change-line skeleton" />
              </div>
            ),
          },
          {
            ...CATEGORIES_COLUMNS_BASE["market-cap"],
            cell: () => <div className="value-skeleton-lg skeleton" />,
          },
          {
            ...CATEGORIES_COLUMNS_BASE.volume,
            cell: () => <div className="value-skeleton-lg skeleton" />,
          },
        ]}
        rowKey={(_, index) => index}
        tableClassName="mt-3"
        bodyCellClassName="py-6!"
      />
    </div>
  );
};

export default Categories;
