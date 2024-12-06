import ProductBenefitsForm from "@/components/Benefits/ProductBenefitsForm";
import ProductForm, {
    ProductFullMediasMixin,
  } from "@/components/Products/ProductForm";
  import { Button } from "@/components/ui/button";
  import { Form } from "@/components/ui/form";
import { useBenefits } from "@/hooks/benefits";
  import { useProduct, useUpdateProduct, useUpdateProductBenefits } from "@/hooks/products";
  
  import { OrganizationContext } from "@/providers";
import { InfoOutlined, WarningAmberOutlined, WarningOutlined } from "@mui/icons-material";
  import { Benefit, ProductUpdate } from "@polar-sh/sdk/models/components";
  import { useCallback, useContext, useMemo, useState } from "react";
  import { useForm } from "react-hook-form";
  import { useNavigate, useParams } from "react-router";
  
  export const EditProductView = () => {
    const { organization } = useContext(OrganizationContext);
    const [loading, setLoading] = useState(false);
  
    const navigate = useNavigate();

    const { id } = useParams();
    const {data: product} = useProduct(id);

    const benefits = useBenefits(organization?.id, 100)
    const organizationBenefits = useMemo(
      () => benefits.data?.result.items ?? [],
      [benefits],
    )
  
    const [enabledBenefitIds, setEnabledBenefitIds] = useState<
      Benefit['id'][]
    >(product?.benefits.map((benefit) => benefit.id) ?? [])


    const form = useForm<ProductUpdate & ProductFullMediasMixin>({
      defaultValues: {
        ...product,
        medias: product?.medias.map((media) => media.id),
        full_medias: product?.medias
      },
    });
    const { handleSubmit } = form;
  
    const updateProduct = useUpdateProduct(organization);
    const updateBenefits = useUpdateProductBenefits(organization)
  
    const onSubmit = useCallback(
      async (productUpdate: ProductUpdate & ProductFullMediasMixin) => {
        try {
          setLoading(true);
          const { full_medias, ...productUpdateRest } = productUpdate;

          // Remove empty ids from prices
          for (const price of productUpdateRest.prices ?? []) {
            if ('id' in price && price.id === '') {
                (price as unknown as { id?: string }).id = undefined;
            }
          }

          const product = await updateProduct.mutateAsync({
            id: id ?? '',
            body: {
              ...productUpdateRest,
              medias: full_medias.map((media) => media.id),
            },
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
      [navigate, updateProduct, id, updateBenefits, enabledBenefitIds]
    );

    const onSelectBenefit = useCallback(
        (benefit: Benefit) => {
          setEnabledBenefitIds((benefitIds) => [...benefitIds, benefit.id])
        },
        [setEnabledBenefitIds],
      )
    
      const onRemoveBenefit = useCallback(
        (benefit: Benefit) => {
          setEnabledBenefitIds((benefits) =>
            benefits.filter((b) => b !== benefit.id),
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
    
      const benefitsAdded = useMemo(
        () =>
          enabledBenefits.filter(
            (benefit) => !product?.benefits.some(({ id }) => id === benefit.id),
          ),
        [enabledBenefits, product],
      )
    
      const benefitsRemoved = useMemo(
        () =>
          product?.benefits.filter(
            (benefit) => !enabledBenefits.some(({ id }) => id === benefit.id),
          ),
        [enabledBenefits, product],
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
            <ProductForm organization={organization} update={true} />
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

      {(benefitsAdded.length > 0 || (benefitsRemoved?.length ?? 0) > 0) && (
        <div className="rounded-lg text-xs p-3 dark:text-neutral-500 dark:bg-neutral-900 flex items-center gap-x-4">
          <InfoOutlined fontSize="small" />
          <div className="flex flex-row">
            Existing customers will immediately{' '}
            {benefitsAdded.length > 0 && (
              <>
                get access to{' '}
                {benefitsAdded.map((benefit) => benefit.description).join(', ')}
              </>
            )}
            {(benefitsRemoved?.length ?? 0) > 0 && (
              <>
                {benefitsAdded.length > 0 && ' and '}lose access to{' '}
                {benefitsRemoved
                  ?.map((benefit) => benefit.description)
                  .join(', ')}
              </>
            )}
            .
          </div>
          </div>
        )}
  
        <div className="flex flex-col gap-y-2">
          <Button
            className="rounded-full"
            size="sm"
            onClick={handleSubmit(onSubmit)}
            disabled={loading}
          >
            Update Product
          </Button>
          <Button
            className="rounded-full"
            size="sm"
            variant="ghost"
            onClick={() => navigate(`/products/${id}`)}
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
      <div className="dark:bg-neutral-900 rounded-md h-12 w-full animate-pulse" />
    );
  };
  