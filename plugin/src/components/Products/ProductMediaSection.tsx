"use client";

import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { useFormContext } from "react-hook-form";
import ProductMediasField from "./ProductMediasField";
import { ProductFormType } from "./ProductForm";
import { useContext } from "react";
import { OrganizationContext } from "@/providers";

export const ProductMediaSection = () => {
  const { organization } = useContext(OrganizationContext);
  const { control } = useFormContext<ProductFormType>();


  if (!organization) {
    return null;
  }

  return (
    <div className="flex flex-col gap-y-6">
      <FormField
        control={control}
        name="full_medias"
        render={({ field }) => (
          <FormItem className="flex w-full flex-col gap-2">
            <FormControl>
              <ProductMediasField
                organization={organization}
                value={(field.value ?? []).map((file) => ({ ...file, service: "product_media" }))}
                onChange={field.onChange}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};
