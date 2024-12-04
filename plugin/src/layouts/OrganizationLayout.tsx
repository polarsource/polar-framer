import { useEffect, useContext } from "react";
import { Avatar } from "../components/Avatar";
import { useOrganizations } from "../hooks/organizations";
import { Link, Outlet, useNavigate } from "react-router";
import { OrganizationContext } from "../providers";

export const OrganizationLayout = () => {
  const { organization, setOrganization } = useContext(OrganizationContext);
  const { data: organizations } = useOrganizations({ limit: 100 });
  const navigate = useNavigate();

  const handleOrganizationChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setOrganization(organizations?.result.items.find((o) => o.id === e.target.value) ?? null);

    navigate(`/products`);
  };

  useEffect(() => {
    if (organizations?.result.items.length && !organization) {
      setOrganization(organizations?.result.items[0]);
    }
  }, [organizations, organization, setOrganization]);

  return (
    <div className="flex w-full h-full flex-col">
      <div className="flex px-4 pb-4 py-2 flex-row items-center gap-x-4 border-b border-white/5">
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
