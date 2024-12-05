import ProductForm, {
    ProductFullMediasMixin,
  } from "@/components/Products/ProductForm";
  import { Button } from "@/components/ui/button";
  import { Form } from "@/components/ui/form";
  import { useProduct, useUpdateProduct } from "@/hooks/products";
  
  import { OrganizationContext } from "@/providers";
  import { ProductUpdate } from "@polar-sh/sdk/models/components";
  import { useCallback, useContext, useState } from "react";
  import { useForm } from "react-hook-form";
  import { useNavigate, useParams } from "react-router";
  
  export const EditProductView = () => {
    const { organization } = useContext(OrganizationContext);
    const [loading, setLoading] = useState(false);
  
    const navigate = useNavigate();
  


    const { id } = useParams();
    const {data: product} = useProduct(id);


    const form = useForm<ProductUpdate & ProductFullMediasMixin>({
      defaultValues: {
        ...product,
        medias: product?.medias.map((media) => media.id),
        full_medias: product?.medias
      },
    });
    const { handleSubmit } = form;
  
    const updateProduct = useUpdateProduct(organization);
  
    const onSubmit = useCallback(
      async (productUpdate: ProductUpdate & ProductFullMediasMixin) => {
        try {
          setLoading(true);
          const { full_medias, ...productUpdateRest } = productUpdate;
  
          const product = await updateProduct.mutateAsync({
            ...productUpdateRest,
            medias: full_medias.map((media) => media.id),
          });
  
          navigate(`/products/${product.id}`);
        } finally {
          setLoading(false);
        }
      },
      [navigate, updateProduct]
    );
  
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
  