import React from "react";
import { ProductInfoSection } from "./ProductInfoSection";
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
    <div className="flex flex-col gap-y-6">
      <ProductInfoSection />
      <ProductPricingSection update={update} />
      {/* <ProductMediaSection /> */}
    </div>
  );
};

export default ProductForm;
