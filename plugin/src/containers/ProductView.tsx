import { useParams } from "react-router";
import { useProduct } from "../hooks/products";
import { POLAR_EMBED_COMPONENT_URL } from "@/utils";
import { framer } from "framer-plugin";
import { Button } from "@/components/ui/button";
import { useCheckoutLinks, useCreateCheckoutLink } from "@/hooks/checkoutLinks";
import { useCallback, useContext, useEffect, useState } from "react";
import { OrganizationContext } from "@/providers";
import { CheckoutLink } from "@polar-sh/sdk/models/components";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export const ProductView = () => {
  const [selectedCheckoutLink, setSelectedCheckoutLink] =
    useState<CheckoutLink>();
  const { id } = useParams();

  const { data: product } = useProduct(id);
  const { organization } = useContext(OrganizationContext);
  const { data: checkoutLinks } = useCheckoutLinks(organization?.id, {
    productId: product?.id,
  });
  const { mutateAsync: createCheckoutLink } = useCreateCheckoutLink(organization?.id);

  const media = product?.medias[0];

  const insertCheckoutComponent = useCallback(() => {
    if (!product || !selectedCheckoutLink) return;

    framer.addComponentInstance({
      url: POLAR_EMBED_COMPONENT_URL,
      attributes: {
        controls: {
          url: selectedCheckoutLink.url,
          theme: 'dark'
        },
      },
    });
  }, [product, selectedCheckoutLink]);

  const handleSelectChange = (value: string) => {
    if (!organization?.id || !product?.id) return;

    setSelectedCheckoutLink(
      checkoutLinks?.result.items.find((link) => link.id === value)
    );
  };

  const handleCreateCheckoutLink = () => {
    if (!organization?.id || !product?.id) return;

    createCheckoutLink({
      label: "Framer Checkout Link",
      productId: product.id,
    });
  };

  useEffect(() => {
    if ((checkoutLinks?.result.items.length ?? 0) > 0) {
      setSelectedCheckoutLink(checkoutLinks?.result.items[0]);
    }
  }, [checkoutLinks]);

  if (!product) return null;

  return (
    <div className="flex flex-col gap-4 p-4">
      <h1 className="text-xl font-medium">{product.name}</h1>
      {media && (
        <img
          className="w-full rounded-md text-lg"
          src={media.publicUrl}
          alt={product.name}
        />
      )}
      <p>{product.description}</p>
      <div className="flex flex-col gap-2">
        {(checkoutLinks?.result.items.length ?? 0) > 0 && (
          <Select
            onValueChange={handleSelectChange}
            value={selectedCheckoutLink?.id || ""}
          >
            <SelectTrigger className="bg-neutral-900 rounded-lg text-sm">
              <SelectValue placeholder="Select Checkout Link" />
            </SelectTrigger>
            <SelectContent>
              {checkoutLinks?.result.items.map((link) => (
                <SelectItem key={link.id} value={link.id}>
                  {link.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}

        <Button
          className="rounded-full"
          onClick={handleCreateCheckoutLink}
          size="sm"
          variant="secondary"
        >
          Create New Checkout Link
        </Button>
      </div>

      <Button
        className="rounded-full"
        onClick={insertCheckoutComponent}
        size="sm"
        disabled={!selectedCheckoutLink}
      >
        Create Checkout
      </Button>
    </div>
  );
};
