import React from "react";
import { ProductInfoSection } from "./ProductInfoSection";
import { ProductMediaSection } from "./ProductMediaSection";
import { ProductPricingSection } from "./ProductPricingSection";
import { Organization, ProductCreate, ProductUpdate } from "@polar-sh/sdk/models/components";
import { ProductMediaFileRead } from "@polar-sh/sdk/models/components";

export interface ProductFullMediasMixin {
  full_medias: ProductMediaFileRead[];
}

export type ProductFormType = (ProductCreate | ProductUpdate) & ProductFullMediasMixin;

interface ProductFormProps {
  organization: Organization;
  update?: boolean;
}

const ProductForm: React.FC<ProductFormProps> = ({ update }) => {
  return (
    <div className="dark:divide-polar-700 flex flex-col divide-y">
      <ProductInfoSection />
      <ProductPricingSection update={update} />
      <ProductMediaSection />
    </div>
  );
};

export default ProductForm;
