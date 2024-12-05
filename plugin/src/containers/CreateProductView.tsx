import ProductBenefitsForm from "@/components/Benefits/ProductBenefitsForm";
import ProductForm, {
  ProductFullMediasMixin,
} from "@/components/Products/ProductForm";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { useBenefits } from "@/hooks/benefits";
import { useCreateProduct, useUpdateProductBenefits } from "@/hooks/products";

import { OrganizationContext } from "@/providers";
import { Benefit, ProductPriceType } from "@polar-sh/sdk/models/components";
import { ProductCreate } from "@polar-sh/sdk/models/components";
import { useCallback, useContext, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";

export const CreateProductView = () => {
  const { organization } = useContext(OrganizationContext);
  const [loading, setLoading] = useState(false);

  const {data: benefits} = useBenefits(organization?.id, 100)
  const organizationBenefits = useMemo(
    () => benefits?.result.items ?? [],
    [benefits],
  )
  const [enabledBenefitIds, setEnabledBenefitIds] = useState<
    Benefit['id'][]
  >([])

  const navigate = useNavigate();

  const form = useForm<ProductCreate & ProductFullMediasMixin>({
    defaultValues: {
      ...{
        prices: [
          {
            type: ProductPriceType.OneTime,
            priceAmount: undefined,
            priceCurrency: "usd",
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
  const { handleSubmit } = form;

  const createProduct = useCreateProduct(organization);
  const updateBenefits = useUpdateProductBenefits(organization)

  const onSubmit = useCallback(
    async (productCreate: ProductCreate & ProductFullMediasMixin) => {
      try {
        setLoading(true);
        const { full_medias, ...productCreateRest } = productCreate;

        const product = await createProduct.mutateAsync({
          ...productCreateRest,
          medias: full_medias.map((media) => media.id),
        });

        await updateBenefits.mutateAsync({
          id: product.id,
          params: {
            benefits: enabledBenefitIds,
          },
        })

        navigate(`/products/${product.id}`);
      } finally {
        setLoading(false);
      }
    },
    [navigate, enabledBenefitIds, createProduct, updateBenefits]
  );



  const onSelectBenefit = useCallback(
    (benefit: Benefit) => {
      setEnabledBenefitIds((benefitIds) => [...benefitIds, benefit.id])
    },
    [setEnabledBenefitIds],
  )

  const onRemoveBenefit = useCallback(
    (benefit: Benefit) => {
      setEnabledBenefitIds((benefitIds) =>
        benefitIds.filter((b) => b !== benefit.id),
      )
    },
    [setEnabledBenefitIds],
  )

  const enabledBenefits = useMemo(
    () =>
      organizationBenefits.filter((benefit) =>
        enabledBenefitIds.includes(benefit.id),
      ),
    [organizationBenefits, enabledBenefitIds],
  )

  if (!organization) {
    return <LoadingView />;
  }

  return (
    <div className="flex flex-col gap-8 p-4 overflow-y-auto">
      <Form {...form}>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col gap-y-6"
        >
          <ProductForm organization={organization} update={false} />
        </form>
      </Form>

      <ProductBenefitsForm
          organization={organization}
          organizationBenefits={organizationBenefits.filter(
            (benefit) =>
              // Hide not selectable benefits unless they are already enabled
              benefit.selectable ||
              enabledBenefits.some((b) => b.id === benefit.id),
          )}
          benefits={enabledBenefits}
          onSelectBenefit={onSelectBenefit}
          onRemoveBenefit={onRemoveBenefit}
      />

      <div className="flex flex-col gap-y-2">
        <Button
          className="rounded-full"
          size="sm"
          onClick={handleSubmit(onSubmit)}
          disabled={loading}
        >
          Create Product
        </Button>
        <Button
          className="rounded-full"
          size="sm"
          variant="ghost"
          onClick={() => navigate(`/products`)}
        >
          Cancel
        </Button>
      </div>
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
