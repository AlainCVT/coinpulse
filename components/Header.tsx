"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { PropsWithChildren } from "react";

import { cn } from "@/lib/utils";

const NavLink = ({
  children,
  href,
  pathname,
}: PropsWithChildren<{ href: `/${string}`; pathname: string }>) => {
  return (
    <Link
      href={href}
      className={cn("nav-link", {
        "is-active": pathname === href,
        "is-home": href === "/",
      })}
    >
      {children}
    </Link>
  );
};

export const Header = () => {
  const pathname = usePathname();

  return (
    <header>
      <div className="main-container inner">
        <Link href="/">
          <Image src="/logo.svg" alt="CoinPulse logo" width={120} height={30} />
        </Link>
        <nav>
          <NavLink href="/" pathname={pathname}>
            Home
          </NavLink>
          <p>Search modal</p>
          <NavLink href="/coins" pathname={pathname}>
            Coins
          </NavLink>
        </nav>
      </div>
    </header>
  );
};
