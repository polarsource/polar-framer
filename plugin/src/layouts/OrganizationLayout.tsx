import { useEffect, useContext, useCallback } from "react";
import { Avatar } from "../components/Avatar";
import { useOrganizations } from "../hooks/organizations";
import { Link, Outlet, useNavigate } from "react-router";
import { OrganizationContext } from "../providers";
import { Organization } from "@polar-sh/sdk/models/components";

export const OrganizationLayout = () => {
  const { organization, setOrganization } = useContext(OrganizationContext);
  const { data: organizations } = useOrganizations({ limit: 100 });
  const navigate = useNavigate();

  const handleOrganizationChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    setOrganization(organizations?.result.items.find((o) => o.id === e.target.value) as Organization);

    navigate(`/products`);
  }, [organizations, setOrganization, navigate]);

  useEffect(() => {
    if (organizations?.result.items.length && !organization) {
      setOrganization(organizations?.result.items[0]);
    }
  }, [organizations, organization, setOrganization]);

  return (
    <div className="flex w-full h-full flex-col">
      <div className="flex p-4 flex-row items-center gap-x-4 border-b border-white/5">
        <Link to="/products">
          <Avatar url={organization?.avatarUrl ?? ""} />
        </Link>
        <select
          className="px-3 flex-grow bg-neutral-900"
          value={organization?.id}
          onChange={handleOrganizationChange}
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
