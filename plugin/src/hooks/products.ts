import { ProductsListRequest } from "@polar-sh/sdk/models/operations";
import { useQuery } from "@tanstack/react-query";
import { useContext } from "react";
import { PolarAPIContext } from "../providers";

export const useProducts = (params: ProductsListRequest) => {
  const polar = useContext(PolarAPIContext);

  return useQuery({
    queryKey: ["products", params],
    queryFn: () => polar.products.list(params),
    enabled: !!params.organizationId,
  });
};
