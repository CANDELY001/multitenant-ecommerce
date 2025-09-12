import {
  ProductView,
  ProductViewSkeleton,
} from "@/modules/products/ui/views/product-view";
import { Suspense } from "react";

export const dynamic = "force-dynamic";

interface Props {
  params: Promise<{ productId: string; slug: string }>;
}

const Page = async ({ params }: Props) => {
  const { productId, slug } = await params;

  return (
    <Suspense fallback={<ProductViewSkeleton />}>
      <ProductView productId={productId} tenantSlug={slug} />
    </Suspense>
  );
};

export default Page;
