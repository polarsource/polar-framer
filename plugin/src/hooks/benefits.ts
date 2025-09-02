import { BenefitCreate } from "@polar-sh/sdk/models/components/benefitcreate";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useContext } from "react";
import { PolarAPIContext, queryClient } from "@/providers";
import { BenefitTypeFilter } from "@polar-sh/sdk/models/operations/benefitslist";
import { BenefitsUpdateRequest } from "@polar-sh/sdk/models/operations/benefitsupdate";

const _invalidateBenefitsQueries = ({
  id,
  orgId,
}: {
  id?: string;
  orgId?: string;
}) => {
  if (id) {
    queryClient.invalidateQueries({
      queryKey: ["benefits", "id", id],
    });
  }

  if (orgId) {
    queryClient.invalidateQueries({
      queryKey: ["benefits", "organization", orgId],
    });
  }
};

export const useBenefits = (
  orgId?: string,
  limit = 30,
  type?: BenefitTypeFilter
) => {
  const polar = useContext(PolarAPIContext);

  return useQuery({
    queryKey: ["benefits", "organization", orgId, { type }],
    queryFn: () =>
      polar.benefits.list({
        organizationId: orgId ?? "",
        limit,
        typeFilter: type,
      }),
    enabled: !!orgId,
  });
};

export const useBenefit = (id?: string) => {
  const polar = useContext(PolarAPIContext);

  return useQuery({
    queryKey: ["benefits", "id", id],
    queryFn: () => {
      return polar.benefits.get({
        id: id ?? "",
      });
    },
    enabled: !!id,
  });
};

export const useUpdateBenefit = (orgId?: string) => {
  const polar = useContext(PolarAPIContext);

  return useMutation({
    mutationFn: ({ id, requestBody }: BenefitsUpdateRequest) => {
      return polar.benefits.update({
        id,
        requestBody,
      });
    },
    onSuccess: (result) => {
      _invalidateBenefitsQueries({ id: result.id, orgId });
    },
  });
};

export const useCreateBenefit = (orgId?: string) => {
  const polar = useContext(PolarAPIContext);

  return useMutation({
    mutationFn: (body: BenefitCreate) => {
      return polar.benefits.create(body);
    },
    onSuccess: (result) => {
      _invalidateBenefitsQueries({ id: result.id, orgId });
    },
  });
};

export const useDeleteBenefit = (orgId?: string) => {
  const polar = useContext(PolarAPIContext);

  return useMutation({
    mutationFn: ({ id }: { id: string }) => {
      return polar.benefits.delete({
        id,
      });
    },
    onSuccess: (result, variables) => {
      _invalidateBenefitsQueries({ id: variables.id, orgId });
    },
  });
};
