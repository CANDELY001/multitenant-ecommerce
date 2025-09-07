"use client";
import { Input } from "@/components/ui/input";
import { BookmarkCheckIcon, ListFilter, SearchIcon } from "lucide-react";
import { CategoriesSidebar } from "./categories-sidebar";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useTRPC } from "@/trpc/client";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";

interface Props {
  disabled?: boolean;
  //data: CustomCategory[];
}

export const SearchInput = ({ disabled }: Props) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isClient, setIsClient] = useState(false);

  const trpc = useTRPC();
  const session = useQuery({
    ...trpc.auth.session.queryOptions(),
    retry: false,
    refetchOnWindowFocus: false,
  });

  // Prevent hydration mismatch by only rendering user-dependent content on client
  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <div className="flex items-center gap-2 w-full">
      <CategoriesSidebar onOpenChange={setIsSidebarOpen} Open={isSidebarOpen} />
      <div className="relative w-full">
        <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-neutral-500" />
        <Input
          className="pl-8"
          placeholder="Search products"
          disabled={disabled}
        />
      </div>
      {/* TODO: Add categories view all button */}
      <Button
        variant="elevated"
        className="size-12 shrink-0 flex lg:hidden md:hidden"
        onClick={() => setIsSidebarOpen(true)}
      >
        <ListFilter className="size-4" />
      </Button>
      {/* Library button - only render on client to prevent hydration mismatch */}
      {isClient && session.data?.user && (
        <Button asChild variant="elevated">
          <Link href="/library">
            <BookmarkCheckIcon className="size-4" />
            Library
          </Link>
        </Button>
      )}
    </div>
  );
};
