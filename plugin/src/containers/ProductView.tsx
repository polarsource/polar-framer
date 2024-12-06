import { useNavigate, useParams } from "react-router";
import { useProduct } from "../hooks/products";
import { POLAR_EMBED_COMPONENT_URL } from "@/utils";
import { framer } from "framer-plugin";
import { Button } from "@/components/ui/button";
import { useCheckoutLinks, useCreateCheckoutLink } from "@/hooks/checkoutLinks";
import { ComponentProps, useCallback, useContext, useMemo } from "react";
import { OrganizationContext } from "@/providers";
import Markdown from "markdown-to-jsx";
import { ProductPrices } from "@/components/ProductPrices";
import { BenefitsList } from "@/components/Benefits/BenefitsList";

export const ProductView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: product } = useProduct(id);
  const { organization } = useContext(OrganizationContext);
  const { data: checkoutLinks } = useCheckoutLinks(
    organization?.id,
    product?.id
  );
  const { mutateAsync: createCheckoutLink } = useCreateCheckoutLink(
    organization?.id
  );

  const media = product?.medias[0];

  const handleCreateCheckoutLink = useCallback(async () => {
    if (!organization?.id || !product?.id) return;

    return await createCheckoutLink({
      label: "Framer Checkout Link",
      productId: product.id,
    });
  }, [organization?.id, product?.id, createCheckoutLink]);

  const framerCheckoutLink = useMemo(() => {
    if (!product) return;

    return checkoutLinks?.result.items.find((link) =>
      link.label?.includes("Framer Checkout Link")
    );
  }, [product, checkoutLinks]);

  const insertCheckoutComponent = useCallback(async () => {
    if (!product) return;

    let link = framerCheckoutLink;

    if (!link) {
      link = await handleCreateCheckoutLink();
    }

    if (!link) return;

    framer.addComponentInstance({
      url: POLAR_EMBED_COMPONENT_URL,
      attributes: {
        controls: {
          url: link.url,
          theme: "dark",
        },
      },
    });
  }, [product, framerCheckoutLink, handleCreateCheckoutLink]);

  const handlePreviewCheckout = useCallback(async () => {
    let link = framerCheckoutLink;

    if (!link) {
      link = await handleCreateCheckoutLink();
    }

    if (!link) return;

    window.open(link.url, "_blank");
  }, [framerCheckoutLink, handleCreateCheckoutLink]);

  if (!product) return null;

  return (
    <div className="flex flex-col gap-6 p-4 overflow-y-auto">
      <div className="flex flex-col gap-2">
        <div className="flex flex-row justify-between items-start">
          <h1 className="text-xl font-medium">{product.name}</h1>
          <Button
            className="rounded-full h-7 w-fit"
            size="sm"
            variant="secondary"
            onClick={() => navigate(`/products/${product.id}/edit`)}
          >
            Edit
          </Button>
        </div>
        <ProductPrices
          className="text-base dark:text-neutral-500"
          prices={product.prices}
        />
      </div>
      {media && (
        <img
          className="w-full rounded-md text-lg"
          src={media.publicUrl}
          alt={product.name}
        />
      )}
      <div className="prose prose-invert prose-headings:mt-4 prose-headings:font-medium prose-h1:text-2xl prose-h2:text-xl prose-h3:text-lg prose-h4:text-md prose-h5:text-sm prose-h6:text-sm prose-headings:text-white dark:text-neutral-300">
        <Markdown
          options={{
            disableParsingRawHTML: false,
            forceBlock: true,
            overrides: {
              embed: () => <></>,
              iframe: () => <></>,
              a: (args: ComponentProps<"a">) => (
                <a {...args} target="_blank" rel="noreferrer" />
              ),
              img: (args: ComponentProps<"img">) => (
                <img {...args} style={{ maxWidth: "100%" }} />
              ),
            },
          }}
        >
          {product.description ?? ""}
        </Markdown>
      </div>
      {product.benefits.length > 0 && (
        <BenefitsList benefits={product.benefits} />
      )}
      <div className="flex flex-col gap-y-2">
        <Button
          className="rounded-full"
          onClick={insertCheckoutComponent}
          size="sm"
        >
          Insert Buy Button
        </Button>
        <Button
          className="rounded-full"
          onClick={handlePreviewCheckout}
          size="sm"
          variant="ghost"
        >
          Preview Checkout
        </Button>
      </div>
    </div>
  );
};
