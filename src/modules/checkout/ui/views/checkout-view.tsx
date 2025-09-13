"use client";
import { toast } from "sonner";
import { useTRPC } from "@/trpc/client";
import { useCart } from "../../hooks/use-cart";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { generateTenantURL } from "@/lib/utils";
import { CheckoutItem } from "../components/checkout-items";
import { CheckoutSidebar } from "../components/checkout-sidebar";
import { InboxIcon, LoaderIcon } from "lucide-react";

interface CheckoutViewProps {
  tenantSlug: string;
}

export const CheckoutView = ({ tenantSlug }: CheckoutViewProps) => {
  const { productIds, removeProduct, clearAllCarts } = useCart(tenantSlug);

  const trpc = useTRPC();
  const { data, error, isLoading } = useQuery(
    trpc.checkout.getProducts.queryOptions({
      ids: productIds,
    })
  );
  useEffect(() => {
    if (error?.data?.code === "NOT_FOUND") {
      clearAllCarts();
      toast.warning("Invalid products found, cart cleared.");
    }
  }, [error, clearAllCarts]);

  if (isLoading) {
    return (
      <div className="lg:pt-16 pt-4 px-4 lg:px-12">
        <div className="border border-black border-dashed flex items-center justify-center p-8 flex-col gap-y-4 bg-white w-full rounded-lg">
          <LoaderIcon className="text-muted-foreground animate-spin" />
        </div>
      </div>
    );
  }
  if (data?.totalDocs === 0) {
    return (
      <div className="lg:pt-16 pt-4 px-4 lg:px-12">
        <div className="border border-black border-dashed flex items-center justify-center p-8 flex-col gap-y-4 bg-white w-full rounded-lg">
          <InboxIcon />
          <p className="text-base font-medium">No products found</p>
        </div>
      </div>
    );
  }
  return (
    <div className="lg:pt-16 pt-4 px-4 lg:px-12">
      <div className="grid grid-cols-1 lg:grid-cols-7 gap-4 lg:gap-16">
        <div className="lg:col-span-4">
          <div className="border rounded-md overflow-hidden bg-white">
            {data?.docs.map((product, index) => {
              // Type assertion to access product properties
              const productData = product as any;
              return (
                <CheckoutItem
                  key={product.id}
                  isLast={index === data.docs.length - 1}
                  imageUrl={
                    typeof product.images === "object" && product.images?.url
                      ? product.images.url
                      : undefined
                  }
                  name={productData.name}
                  productUrl={`${generateTenantURL(
                    typeof product.tenant === "object" && product.tenant?.slug
                      ? product.tenant.slug
                      : "admin"
                  )}/products/${product.id}`}
                  tenantUrl={generateTenantURL(
                    typeof product.tenant === "object" && product.tenant?.slug
                      ? product.tenant.slug
                      : "admin"
                  )}
                  tenantName={
                    typeof product.tenant === "object" && product.tenant?.name
                      ? product.tenant.name
                      : "Unknown Tenant"
                  }
                  price={productData.price}
                  onRemove={() => removeProduct(String(product.id))}
                />
              );
            })}
          </div>
        </div>
        <div className="lg:col-span-3">
          <CheckoutSidebar
            total={data?.totalPrice || 0}
            onPurchase={() => {}}
            isCanceled={false}
            disabled={false}
          />
        </div>
      </div>
    </div>
  );
};
