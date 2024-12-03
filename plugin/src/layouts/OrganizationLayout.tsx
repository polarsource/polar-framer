import { useEffect, useMemo } from "react";
import { Avatar } from "../components/Avatar";
import { useOrganizations } from "../hooks/organizations";
import { Outlet, useLocation, useNavigate, useParams } from "react-router";

export const OrganizationLayout = () => {
  const { organizationId } = useParams();

  const { data: organizations } = useOrganizations({ limit: 100 });

  const organization = useMemo(
    () => organizations?.result.items.find((o) => o.id === organizationId),
    [organizations, organizationId]
  );

  const navigate = useNavigate();
  const { pathname } = useLocation();

  useEffect(() => {
    if (organizationId && !pathname.includes("/products")) {
      navigate(`/${organizationId}/products`);
    }
  }, [organizationId, navigate, pathname]);

  return (
    <div className="flex w-full h-full flex-col">
      <div className="flex px-4 pb-4 py-2 flex-row items-center gap-x-4 border-b border-white/5">
        <Avatar url={organization?.avatarUrl ?? ""} />
        <select
          className="px-3 flex-grow bg-neutral-900"
          value={organizationId}
          onChange={(e) => navigate(`/${e.target.value}/products`)}
        >
          {organizations?.result.items.map((organization) => (
            <option key={organization.id} value={organization.id}>
              {organization.name}
            </option>
          ))}
        </select>
      </div>
      <Outlet />
    </div>
  );
};
