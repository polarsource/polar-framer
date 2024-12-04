import ProductForm, { ProductFullMediasMixin } from "@/components/Products/ProductForm";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { useCreateProduct } from "@/hooks/products";

import { OrganizationContext } from "@/providers";
import { ProductPriceType } from "@polar-sh/sdk/models/components";
import { ProductCreate } from "@polar-sh/sdk/models/components";
import { useCallback, useContext, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";

export const CreateProductView = () => {
  const { organization } = useContext(OrganizationContext);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const form = useForm<ProductCreate & ProductFullMediasMixin>({
    defaultValues: {
      ...{
        prices: [
          {
            type: ProductPriceType.OneTime,
            priceAmount: undefined,
            priceCurrency: 'usd',
          },
        ],
      },
      ...{
        medias: [],
        full_medias: [],
      },
      organizationId: organization?.id,
    },
  });
  const { handleSubmit } = form

  const createProduct = useCreateProduct(organization)

  const onSubmit = useCallback(
    async (productCreate: ProductCreate & ProductFullMediasMixin) => {
      try {
        setLoading(true)
        const { full_medias, ...productCreateRest } = productCreate
        
        const product = await createProduct.mutateAsync({
          ...productCreateRest,
          medias: full_medias.map((media) => media.id),
        })
 
        navigate(`/${organization?.slug}/products`)
      } finally {
        setLoading(false)
      }
    },
    [
      organization,
      navigate,
      createProduct,
    ],
  )

  if (!organization) {
    return <LoadingView />;
  }

  return (
    <div className="flex flex-col gap-4 p-4">
      <Form {...form}>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col gap-y-6"
        >
          <ProductForm organization={organization} update={false} />
        </form>
      </Form>

      <Button onClick={handleSubmit(onSubmit)} disabled={loading}>Create Product</Button>
    </div>
  );
};

const LoadingView = () => {
  return (
    <div className="flex flex-col gap-2 p-4">
      <Skeleton />
      <Skeleton />
      <Skeleton />
      <Skeleton />
      <Skeleton />
    </div>
  );
};

const Skeleton = () => {
  return (
    <div className="bg-neutral-900 rounded-md h-12 w-full animate-pulse" />
  );
};
