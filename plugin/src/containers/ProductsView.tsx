import { useProducts } from "../hooks/products";
import { useOrganizations } from "../hooks/organizations";
import { useState } from "react";
import { Avatar } from "../components/Avatar";
import { Product } from "@polar-sh/sdk/models/components";

export const ProductsView = () => {
  const [organizationId, setOrganizationId] = useState<string | null>(null);

  const { data: organizations } = useOrganizations({ limit: 100 });
  const { data: products } = useProducts({ limit: 100, organizationId });

  const organization = organizations?.result.items.find(
    (o) => o.id === organizationId
  );

  return (
    <div className="flex w-full flex-col gap-6">
      <div className="flex flex-row items-center gap-x-4">
        <Avatar url={organization?.avatarUrl ?? ""} />
        <select
          className="px-3 flex-grow !border !border-neutral-500 bg-neutral-900"
          onChange={(e) => setOrganizationId(e.target.value)}
        >
          {organizations?.result.items.map((organization) => (
            <option key={organization.id} value={organization.id}>
              {organization.name}
            </option>
          ))}
        </select>
      </div>
      <div className="flex flex-col gap-4">
        <div className="flex flex-row items-center gap-x-4 justify-between">
          <h3 className="text-base">Products</h3>
          <button className="framer-button-primary w-6 h-6 flex flex-col items-center justify-center rounded-full">
            <svg className="h-3 w-3" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 5v14m7-7H5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>
        <div className="flex flex-col gap-2">
          {products?.result.items.map((product) => (
            <ProductRow key={product.id} product={product} />
          ))}
        </div>
      </div>
    </div>
  );
};

const ProductRow = ({ product }: { product: Product }) => {

  return (
    <div className="flex flex-row gap-2 bg-neutral-900 hover:bg-neutral-800 p-4 py-3 rounded-xl transition-colors duration-75 cursor-pointer">
      <div className="flex flex-row items-center gap-x-2">
        <div className="flex flex-col gap-y-1">
          <h3 className="text-sm font-medium">{product.name}</h3>
          <p className="text-xs text-neutral-500">
            {product.benefits.length === 1 ? "1 Benefit" : `${product.benefits.length} Benefits`}
          </p>
        </div>
      </div>
    </div>
  );
};
