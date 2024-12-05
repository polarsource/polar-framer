import { useParams } from "react-router";
import { useProduct } from "../hooks/products";
import { POLAR_EMBED_COMPONENT_URL } from "@/utils";
import { framer } from "framer-plugin";
import { Button } from "@/components/ui/button";
import { useCheckoutLinks, useCreateCheckoutLink } from "@/hooks/checkoutLinks";
import {
  ComponentProps,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { OrganizationContext } from "@/providers";
import { CheckoutLink } from "@polar-sh/sdk/models/components";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Markdown from "markdown-to-jsx";
import { AddOutlined } from "@mui/icons-material";
import { ProductPrices } from "@/components/ProductPrices";
import { BenefitsList } from "@/components/Benefits/BenefitsList";

export const ProductView = () => {
  const [selectedCheckoutLink, setSelectedCheckoutLink] =
    useState<CheckoutLink>();
  const { id } = useParams();

  const { data: product } = useProduct(id);
  const { organization } = useContext(OrganizationContext);
  const { data: checkoutLinks } = useCheckoutLinks(organization?.id, product?.id);
  const { mutateAsync: createCheckoutLink } = useCreateCheckoutLink(
    organization?.id
  );

  const media = product?.medias[0];

  const insertCheckoutComponent = useCallback(() => {
    if (!product || !selectedCheckoutLink) return;

    framer.addComponentInstance({
      url: POLAR_EMBED_COMPONENT_URL,
      attributes: {
        controls: {
          url: selectedCheckoutLink.url,
          theme: "dark",
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

  const handleCreateCheckoutLink = async () => {
    if (!organization?.id || !product?.id) return;

    const count = checkoutLinks?.result.items.filter(link => link.label?.includes("Framer Checkout Link")).length ?? 0;
    const label = count > 0 ? `Framer Checkout Link (${count + 1})` : "Framer Checkout Link";

    const checkoutLink = await createCheckoutLink({
      label,
      productId: product.id,
    });

    setSelectedCheckoutLink(checkoutLink);
  };

  useEffect(() => {
    if (!selectedCheckoutLink && (checkoutLinks?.result.items.length ?? 0) > 0) {
      setSelectedCheckoutLink(checkoutLinks?.result.items[0]);
    }
  }, [checkoutLinks, selectedCheckoutLink]);

  if (!product) return null;

  return (
    <div className="flex flex-col gap-6 p-4 overflow-y-auto">
      <div className="flex flex-col gap-2">
        <h1 className="text-xl font-medium">{product.name}</h1>
        <ProductPrices className="text-base text-neutral-500" prices={product.prices} />
      </div>
      {media && (
        <img
          className="w-full rounded-md text-lg"
          src={media.publicUrl}
          alt={product.name}
        />
      )}
      <div className="prose prose-invert prose-headings:mt-4 prose-headings:font-medium prose-h1:text-2xl prose-h2:text-xl prose-h3:text-lg prose-h4:text-md prose-h5:text-sm prose-h6:text-sm prose-headings:text-white text-neutral-300">
        <Markdown
          options={{
            disableParsingRawHTML: false,
            forceBlock: true,
            overrides: {
              embed: () => <></>,
              iframe: () => <></>,
              // example style overrides
              img: (args: ComponentProps<"img">) => (
                <img {...args} style={{ maxWidth: "100%" }} />
              ),
            },
          }}
        >
          {product.description ?? ""}
        </Markdown>
      </div>
      {product.benefits.length > 0 && <BenefitsList benefits={product.benefits} />}
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <h2 className="text-sm font-medium">Checkout Links</h2>
          <p className="text-xs text-neutral-500">
            Select an existing checkout link or create a new one for this
            product.
          </p>

          {(checkoutLinks?.result.items.length ?? 0) > 0 && (
            <div className="flex items-center flex-row gap-x-4">
              <Select
                onValueChange={handleSelectChange}
                value={selectedCheckoutLink?.id || ""}
              >
                <SelectTrigger className="bg-neutral-900 rounded-lg flex-grow text-xs w-fit">
                  <SelectValue placeholder="Select Checkout Link" />
                </SelectTrigger>
                <SelectContent>
                  {checkoutLinks?.result.items.map((link) => {
                    return (
                      <SelectItem
                        className="text-xs"
                        key={link.id}
                        value={link.id}
                      >
                        {link.label ?? "Untitled"}
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
                <Button
                  className="rounded-full h-8 w-8 flex" 
                  onClick={handleCreateCheckoutLink}
                  size="icon"
                  variant="secondary"
                >
                  <AddOutlined fontSize="small" />
                </Button>
            </div>
          )}
        </div>

        {(!checkoutLinks?.result.items.length || checkoutLinks.result.items.length === 0) && (
          <Button
            className="rounded-full"
            onClick={handleCreateCheckoutLink}
            size="sm"
            variant="secondary"
          >
            Create New Checkout Link
          </Button>
        )}
      </div>

      <Button
        className="rounded-full"
        onClick={insertCheckoutComponent}
        size="sm"
        disabled={!selectedCheckoutLink}
      >
        Generate Checkout Component
      </Button>
    </div>
  );
};
