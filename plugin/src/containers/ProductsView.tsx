import { useProducts } from "../hooks/products";
import { Product } from "@polar-sh/sdk/models/components";
import { AddOutlined } from "@mui/icons-material";
import { Link, useParams } from "react-router";

export const ProductsView = () => {
  const { organizationId } = useParams();

  const { data: products } = useProducts({
    limit: 100,
    organizationId,
    isArchived: false,
  });

  return (
    <>
      {products ? (
        <div className="flex flex-grow min-h-0 flex-col gap-4 p-4 overflow-y-auto">
          <div className="flex flex-row items-center gap-x-4 justify-between">
            <h3 className="text-base">Products</h3>
            <button className="bg-blue-500 w-6 h-6 flex flex-col items-center justify-center rounded-full">
              <AddOutlined fontSize="inherit" />
            </button>
          </div>
          <div className="flex flex-col gap-2">
            {products.result.items.map((product) => (
              <ProductRow key={product.id} product={product} />
            ))}
          </div>
        </div>
      ) : (
        <LoadingView />
      )}
    </>
  );
};

const Skeleton = () => {
  return (
    <div className="bg-neutral-900 rounded-md h-12 w-full animate-pulse" />
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

const ProductRow = ({ product }: { product: Product }) => {
  const { organizationId } = useParams();
  
  return (
    <Link
      to={`/${organizationId}/products/${product.id}`}
      className="flex flex-row gap-2 bg-neutral-900 hover:bg-neutral-800 p-4 py-3 rounded-xl transition-colors duration-75 cursor-pointer"
    >
      <div className="flex flex-row items-center gap-x-2">
        <div className="flex flex-col gap-y-1">
          <h3 className="text-sm font-medium">{product.name}</h3>
          <p className="text-xs text-neutral-500">
            {product.benefits.length === 1
              ? "1 Benefit"
              : `${product.benefits.length} Benefits`}
          </p>
        </div>
      </div>
    </Link>
  );
};
