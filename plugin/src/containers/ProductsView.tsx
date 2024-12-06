import { useProducts } from "../hooks/products";
import { Product } from "@polar-sh/sdk/models/components";
import {
  AddOutlined,
  TextureOutlined,
} from "@mui/icons-material";
import { Link, useNavigate } from "react-router";
import { useContext } from "react";
import { OrganizationContext } from "../providers";
import { ProductPrices } from "@/components/ProductPrices";
import { Button } from "@/components/ui/button";

export const ProductsView = () => {
  const { organization } = useContext(OrganizationContext);
  const navigate = useNavigate();
  const { data: products } = useProducts({
    limit: 100,
    organizationId: organization?.id,
    isArchived: false,
  });

  return (
    <>
      <div className="border-b border-neutral-900 flex flex-row items-center p-4 gap-x-4 justify-between">
        <h3 className="text-sm font-medium">Products</h3>
        <button
          className="bg-blue-500 w-6 h-6 flex flex-col items-center justify-center rounded-full"
          onClick={() => navigate("/products/new")}
        >
          <AddOutlined fontSize="inherit" />
        </button>
      </div>
      {products ? (
        products.result.items.length > 0 ? (
          <div className="flex flex-grow min-h-0 flex-col gap-4 p-4 overflow-y-auto">
            <div className="flex flex-col gap-2">
              {products.result.items.map((product) => (
                <ProductRow key={product.id} product={product} />
              ))}
            </div>
          </div>
        ) : (
          <div className="items-center flex-grow p-4 justify-center gap-y-6 flex flex-col">
            <div className="flex flex-col items-center gap-y-4">
              <div className="flex flex-col items-center gap-y-1">
                <h3 className="font-medium text-sm">No products found</h3>
                <p className="text-neutral-500 text-xs">
                  Start selling digital products today
                </p>
              </div>
              <Button
                className="rounded-full"
                size="sm"
                variant="secondary"
                onClick={() => navigate("/products/new")}
              >
                Create Product
              </Button>
            </div>
          </div>
        )
      ) : (
        <LoadingView />
      )}
    </>
  );
};

const Skeleton = () => {
  return (
    <div className="bg-neutral-900 rounded-xl h-16 w-full animate-pulse" />
  );
};

const LoadingView = () => {
  return (
    <div className="flex flex-col gap-2 p-4 pt-0">
      <Skeleton />
      <Skeleton />
      <Skeleton />
      <Skeleton />
      <Skeleton />
    </div>
  );
};

const ProductRow = ({ product }: { product: Product }) => {
  return (
    <Link
      to={`/products/${product.id}`}
      className="flex flex-row gap-2 bg-neutral-900 hover:bg-neutral-800 p-2 rounded-xl transition-colors duration-75 cursor-pointer"
    >
      <div className="flex w-full flex-row items-center gap-x-4">
        {product.medias[0] ? (
          <img
            src={product.medias[0].publicUrl}
            alt={`${product.name} media`}
            className="w-12 h-12 object-cover rounded-md"
          />
        ) : (
          <div className="w-12 h-12 flex flex-col items-center justify-center rounded-md bg-neutral-800">
            <TextureOutlined className="text-neutral-700" />
          </div>
        )}
        <div className="flex flex-col gap-y-1">
          <h3 className="text-sm font-medium truncate line-clamp-1">
            {product.name}
          </h3>
          <div className="flex text-xs text-neutral-500 flex-row items-center gap-x-2">
            <ProductPrices prices={product.prices} />
          </div>
        </div>
      </div>
    </Link>
  );
};
