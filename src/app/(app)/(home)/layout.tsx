import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { Suspense, type ReactNode } from "react";
import { Footer } from "../../../modules/home/ui/components/footer";
import { Navbar } from "../../../modules/home/ui/components/navbar";
import {
  SearchFilters,
  SearchFiltersLoading,
} from "../../../modules/home/ui/components/search-filters";
import { getQueryClient, trpc } from "@/trpc/server";
import { Search } from "lucide-react";

interface layoutProps {
  children: ReactNode;
}
const layout = async ({ children }: layoutProps) => {
  const queryClient = getQueryClient();
  void queryClient.prefetchQuery(trpc.categories.getMany.queryOptions());
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <HydrationBoundary state={dehydrate(queryClient)}>
        <Suspense fallback={<SearchFiltersLoading />}>
          <SearchFilters />
        </Suspense>
      </HydrationBoundary>
      <div className="flex-1 bg-[#F4F4F4]">{children}</div>
      <Footer />
    </div>
  );
};

export default layout;
