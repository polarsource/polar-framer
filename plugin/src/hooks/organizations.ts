import { OrganizationsListRequest } from "@polar-sh/sdk/models/operations";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useContext } from "react";
import { PolarAPIContext, queryClient } from "../providers";
import { OrganizationCreate } from "@polar-sh/sdk/models/components";

export const useOrganizations = (params: OrganizationsListRequest) => {
  const polar = useContext(PolarAPIContext);
 
  return useQuery({
    queryKey: ["organizations", params],
    queryFn: () => polar.organizations.list(params),
  });
}


export const useCreateOrganization = () => {
  const polar = useContext(PolarAPIContext);

  return useMutation({
    mutationFn: (body: OrganizationCreate) => {
      return polar.organizations.create(body)
    },
    onSuccess: async () => {
      queryClient.invalidateQueries({
        queryKey: ['organizations'],
      })
    },
  })
}