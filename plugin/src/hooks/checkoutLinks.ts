import { useMutation, useQuery } from "@tanstack/react-query";
import {
  CheckoutLink,
  CheckoutLinkCreate,
  ListResourceCheckoutLink,
} from "@polar-sh/sdk/models/components";
import { useContext } from "react";
import { PolarAPIContext, queryClient } from "@/providers";
import { CheckoutLinksListRequest, CheckoutLinksUpdateRequest, OrganizationIDFilter } from "@polar-sh/sdk/models/operations";

export const useCheckoutLinks = (
  organizationId?: OrganizationIDFilter,
  parameters?: Omit<CheckoutLinksListRequest, "organizationId">
) => {
  const polar = useContext(PolarAPIContext);

  return useQuery({
    queryKey: ["checkout_links", organizationId, parameters],
    queryFn: () =>
      polar.checkoutLinks.list({
        organizationId,
        ...(parameters || {}),
      }),
    enabled: !!organizationId,
  });
};

export const useCreateCheckoutLink = (organizationId?: OrganizationIDFilter) => {
  const polar = useContext(PolarAPIContext);

  return useMutation({
    mutationFn: (body: CheckoutLinkCreate) => {
      return polar.checkoutLinks.create(body);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["checkout_links", organizationId],
      });
    },
  });
};
export const useUpdateCheckoutLink = (organizationId?: OrganizationIDFilter) => {
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

export const useDeleteCheckoutLink = (organizationId?: OrganizationIDFilter) => {
  const polar = useContext(PolarAPIContext);

  return useMutation({
    mutationFn: (checkoutLink: CheckoutLink) => {
      return polar.checkoutLinks.delete({
        id: checkoutLink.id,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [
          "checkout_links",
          organizationId,
        ],
      });
    },
  });
};
