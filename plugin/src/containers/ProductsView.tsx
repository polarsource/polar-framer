import { useProducts } from "../hooks/products";
import { Product } from "@polar-sh/sdk/models/components";
import { AddOutlined } from "@mui/icons-material";
import { Link, useNavigate, useParams } from "react-router";
import { useContext } from "react";
import { OrganizationContext } from "../providers";

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
      <div className="flex flex-row items-center p-4 gap-x-4 justify-between">
        <h3 className="text-base">Products</h3>
        <button
          className="bg-blue-500 w-6 h-6 flex flex-col items-center justify-center rounded-full"
          onClick={() => navigate("/products/new")}
        >
          <AddOutlined fontSize="inherit" />
        </button>
      </div>
      {products ? (
        <div className="flex flex-grow min-h-0 flex-col gap-4 p-4 pt-0 overflow-y-auto">
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
  return (
    <Link
      to={`/products/${product.id}`}
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
