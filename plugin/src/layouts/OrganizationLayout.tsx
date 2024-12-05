import { useEffect, useContext, useCallback } from "react";
import { Avatar } from "../components/Avatar";
import { useOrganizations } from "../hooks/organizations";
import { Link, Outlet, useNavigate } from "react-router";
import { OrganizationContext, PolarAPIContext, queryClient } from "../providers";
import { Organization } from "@polar-sh/sdk/models/components";
import { Button } from "@/components/ui/button";
import {
  AddOutlined,
  ArrowOutwardOutlined,
  LogoutOutlined,
} from "@mui/icons-material";
import { baseUrl } from "@/utils";

export const OrganizationLayout = ({ onLogout }: { onLogout: () => void }) => {
  const { organization, setOrganization } = useContext(OrganizationContext);
  const { data: organizations } = useOrganizations({ limit: 100 });
  const navigate = useNavigate();

  const handleOrganizationChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      setOrganization(
        organizations?.result.items.find(
          (o) => o.id === e.target.value
        ) as Organization
      );

      navigate(`/products`);
    },
    [organizations, setOrganization, navigate]
  );

  useEffect(() => {
    if (organizations?.result.items.length && !organization) {
      setOrganization(organizations?.result.items[0]);
    }
  }, [organizations, organization, setOrganization]);

  const polar = useContext(PolarAPIContext);

  return (
    <div className="flex w-full flex-grow min-h-0 h-full flex-col">
      <div className="flex p-4 w-full flex-row items-center gap-x-2 border-b border-white/5">
        <Link to="/products">
          <Avatar
            url={organization?.avatarUrl ?? ""}
            name={organization?.name ?? ""}
          />
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
        <div className="flex flex-row items-center">
          <Button
            size="icon"
            className="text-white rounded-full h-7 w-7"
            variant="ghost"
            onClick={() => navigate("/onboarding")}
          >
            <AddOutlined fontSize="small" />
          </Button>
          <a
            href={`${baseUrl}/dashboard/${organization?.slug}`}
            target="_blank"
          >
            <Button
              size="icon"
              className="text-white rounded-full h-7 w-7"
              variant="ghost"
            >
              <ArrowOutwardOutlined fontSize="small" />
            </Button>
          </a>
          <Button
            size="icon"
            className="text-white rounded-full h-7 w-7"
            variant="ghost"
            onClick={onLogout}
          >
            <LogoutOutlined fontSize="small" />
          </Button>
        </div>
      </div>
      <Outlet />
    </div>
  );
};
