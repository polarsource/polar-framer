import { ProductsListRequest } from "@polar-sh/sdk/models/operations";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useContext } from "react";
import { PolarAPIContext, queryClient } from "../providers";
import { ProductCreate } from "@polar-sh/sdk/models/components";
import { Organization } from "@polar-sh/sdk/models/components";

export const useProducts = ({organizationId, ...params}: ProductsListRequest) => {
  const polar = useContext(PolarAPIContext);
  
  return useQuery({
    queryKey: ["products", organizationId, params],
    queryFn: () => polar.products.list({ organizationId, ...params }),
    enabled: !!organizationId,
  });
};

export const useProduct = (id?: string) => {
  const polar = useContext(PolarAPIContext);

  return useQuery({
    queryKey: ["product", id],
    queryFn: () => polar.products.get({ id: id ?? "" }),
    enabled: !!id,
  });
};

export const useCreateProduct = (organization?: Organization) => {
  const polar = useContext(PolarAPIContext);

  return  useMutation({
    mutationFn: (body: ProductCreate) => {
      return polar.products.create(body)
    },
    onSuccess: async () => {
      queryClient.invalidateQueries({
        queryKey: ['products', organization?.id],
      })
    },
  })
}