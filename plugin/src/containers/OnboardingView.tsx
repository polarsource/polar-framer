import LogoIcon from "@/components/LogoIcon";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCreateOrganization, useOrganizations } from "@/hooks/organizations";
import { OrganizationContext } from "@/providers";
import { useCallback, useContext, useState } from "react";
import { useNavigate } from "react-router";

export const OnboardingView = () => {
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");

  const { setOrganization } = useContext(OrganizationContext);
  const { data: organizations } = useOrganizations({ limit: 100 });

  const navigate = useNavigate();

  const handleOrganizationSlugChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setSlug(e.target.value.toLowerCase().replace(/ /g, "-"));
    },
    [setSlug]
  );

  const handleOrganizationNameChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setName(e.target.value);
      handleOrganizationSlugChange(e);
    },
    [handleOrganizationSlugChange]
  );

  const { mutateAsync: createOrganization } = useCreateOrganization();

  const handleCreateOrganization = useCallback(async () => {
    const organization = await createOrganization({ name, slug });
    setOrganization(organization);
    navigate("/products");
  }, [name, slug, navigate, setOrganization, createOrganization]);

  return (
    <div className="flex flex-col h-full p-4 w-full">
      <div className="flex flex-grow flex-col gap-y-6 justify-center items-center">
        <LogoIcon size={40} />
        <div className="flex flex-col gap-y-1 text-center items-center">
          <h1 className="text-lg font-medium">Welcome to Polar</h1>
          <p className="text-sm text-neutral-500">
            Let's create your organization
          </p>
        </div>
        <div className="flex flex-col gap-y-2 w-full">
          <Input
            type="text"
            className="bg-neutral-900 text-sm placeholder:text-neutral-500"
            placeholder="Name"
            value={name}
            onChange={handleOrganizationNameChange}
            autoComplete="off"
          />
          <Input
            type="text"
            className="bg-neutral-900 text-sm placeholder:text-neutral-500"
            placeholder="Slug"
            value={slug}
            onChange={handleOrganizationSlugChange}
            autoComplete="off"
          />
        </div>
      </div>

      <div className="flex flex-col gap-y-2 w-full">
        <Button
          className="rounded-full"
          size="sm"
          onClick={handleCreateOrganization}
          disabled={name.length < 3 || slug.length < 3}
        >
          Create
        </Button>
        {(organizations?.result.items.length ?? 0) > 0 && (
          <Button
            size="sm"
            className="rounded-full"
            onClick={() => {
              setOrganization(organizations?.result.items[0]);
              navigate("/products");
            }}
            variant="ghost"
          >
            Skip
          </Button>
        )}
      </div>
    </div>
  );
};
