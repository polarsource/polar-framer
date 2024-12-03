import { OrganizationsListRequest } from "@polar-sh/sdk/models/operations";
import { useQuery } from "@tanstack/react-query";
import { useContext } from "react";
import { PolarAPIContext } from "../providers";

export const useOrganizations = (params: OrganizationsListRequest) => {
  const polar = useContext(PolarAPIContext);
 
  return useQuery({
    queryKey: ["organizations", params],
    queryFn: () => polar.organizations.list(params),
  });
}