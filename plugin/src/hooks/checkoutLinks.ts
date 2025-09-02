import { useMutation, useQuery } from "@tanstack/react-query";
import { CheckoutLink } from "@polar-sh/sdk/models/components/checkoutlink";
import { useContext } from "react";
import { PolarAPIContext, queryClient } from "@/providers";
import { CheckoutLinksListRequest } from "@polar-sh/sdk/models/operations/checkoutlinkslist";
import { CheckoutLinksUpdateRequest } from "@polar-sh/sdk/models/operations/checkoutlinksupdate";
import {
  OrganizationIDFilter,
  ProductIDFilter,
} from "@polar-sh/sdk/models/operations/subscriptionslist";
import { CheckoutLinkCreateProduct } from "@polar-sh/sdk/models/components/checkoutlinkcreateproduct";

export const useCheckoutLinks = (
  organizationId?: OrganizationIDFilter,
  productId?: ProductIDFilter,
  parameters?: Omit<CheckoutLinksListRequest, "organizationId">
) => {
  const polar = useContext(PolarAPIContext);

  return useQuery({
    queryKey: ["checkout_links", organizationId, productId, parameters],
    queryFn: () =>
      polar.checkoutLinks.list({
        organizationId,
        productId,
        ...(parameters || {}),
      }),
    enabled: !!organizationId && !!productId,
  });
};

export const useCreateCheckoutLink = (
  organizationId?: OrganizationIDFilter
) => {
  const polar = useContext(PolarAPIContext);

  return useMutation({
    mutationFn: (body: CheckoutLinkCreateProduct) => {
      return polar.checkoutLinks.create(body);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["checkout_links", organizationId],
      });
    },
  });
};
export const useUpdateCheckoutLink = (
  organizationId?: OrganizationIDFilter
) => {
  const polar = useContext(PolarAPIContext);

  return useMutation({
    mutationFn: (body: CheckoutLinksUpdateRequest) => {
      return polar.checkoutLinks.update(body);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["checkout_links", organizationId],
      });
    },
  });
};

export const useDeleteCheckoutLink = (
  organizationId?: OrganizationIDFilter
) => {
  const polar = useContext(PolarAPIContext);

  return useMutation({
    mutationFn: (checkoutLink: CheckoutLink) => {
      return polar.checkoutLinks.delete({
        id: checkoutLink.id,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["checkout_links", organizationId],
      });
    },
  });
};
