// import { useDeleteBenefit } from "@/hooks/benefits";
import {
  AddOutlined,
  CheckOutlined,
  MoreVertOutlined,
  RemoveOutlined,
} from "@mui/icons-material";
import {
  Benefit,
  BenefitCreate,
  BenefitType,
  Organization,
} from "@polar-sh/sdk/models/components";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useCallback, useContext, useState } from "react";
import { twMerge } from "tailwind-merge";
import {
  baseUrl,
  benefitsDisplayNames,
  resolveBenefitCategoryIcon,
} from "@/utils";
import { OrganizationContext } from "@/providers";
import { ChevronDownIcon, ChevronUpIcon } from "lucide-react";
import { useCreateBenefit, useDeleteBenefit } from "@/hooks/benefits";
import { BenefitForm } from "./BenefitForm";
import { useForm } from "react-hook-form";
import { Form } from "../ui/form";

interface BenefitRowProps {
  organization: Organization;
  benefit: Benefit;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
}

const BenefitRow = ({
  organization,
  benefit,
  checked,
  onCheckedChange,
}: BenefitRowProps) => {
  const deleteBenefit = useDeleteBenefit(organization.id);

  const handleDeleteBenefit = useCallback(() => {
    deleteBenefit.mutateAsync({ id: benefit.id });
  }, [deleteBenefit, benefit]);

  return (
    <div
      className={twMerge("flex w-full flex-row items-center justify-between")}
    >
      <div className="flex flex-row items-center gap-x-2">
        <span
          className={twMerge(
            "flex h-5 w-5 shrink-0 flex-row items-center justify-center rounded-full text-sm",
            checked
              ? "dark:bg-white bg-black dark:text-black text-white"
              : "dark:bg-neutral-800 text-neutral-500"
          )}
        >
          {checked ? (
            <CheckOutlined fontSize="inherit" />
          ) : (
            <RemoveOutlined fontSize="inherit" />
          )}
        </span>
        <span
          className={twMerge("text-xs", checked ? "opacity-100" : "opacity-50")}
        >
          {benefit.description}
        </span>
      </div>
      <div className="flex flex-row items-center gap-x-2">
        <Switch
          className="p-0.5 h-4 w-8 [&>span]:h-3 [&>span]:w-3"
          checked={checked}
          onCheckedChange={onCheckedChange}
          disabled={!benefit.selectable}
        />
        <DropdownMenu>
          <DropdownMenuTrigger className="h-6 w-6" asChild>
            <Button
              className={
                "border-none bg-transparent text-[16px] opacity-50 transition-opacity hover:opacity-100 shadow-none"
              }
              size="icon"
              variant="secondary"
            >
              <MoreVertOutlined fontSize="inherit" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="dark:bg-neutral-800 shadow-lg"
          >
            <DropdownMenuItem>Edit</DropdownMenuItem>
            {benefit.deletable && (
              <DropdownMenuItem onClick={handleDeleteBenefit}>
                Delete
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};

interface ProductBenefitsFormProps {
  organization: Organization;
  benefits: Benefit[];
  organizationBenefits: Benefit[];
  onSelectBenefit: (benefit: Benefit) => void;
  onRemoveBenefit: (benefit: Benefit) => void;
}

const ProductBenefitsForm = ({
  benefits,
  organizationBenefits,
  onSelectBenefit,
  onRemoveBenefit,
}: ProductBenefitsFormProps) => {
  const { organization } = useContext(OrganizationContext);

  const handleCheckedChange = useCallback(
    (benefit: Benefit) => (checked: boolean) => {
      if (checked) {
        onSelectBenefit(benefit);
      } else {
        onRemoveBenefit(benefit);
      }
    },
    [onSelectBenefit, onRemoveBenefit]
  );

  return (
    <div className="flex flex-col gap-y-4">
      <div className="flex flex-col gap-y-2">
        <h3 className="text-sm font-medium">Automated Benefits</h3>
        <p className="text-xs text-neutral-500">
          Benefits can be granted to customers upon purchase of this product,
          and are reusable across your organization.
        </p>
      </div>
      <div className="flex w-full flex-col gap-y-2">
        {Object.entries(benefitsDisplayNames)
          .filter(([type]) =>
            ["license_keys", "downloadables", "custom"].some((t) => t === type)
          )
          .map(([type, title]) => (
            <BenefitsContainer
              key={type}
              title={title}
              type={type as "license_keys" | "downloadables" | "custom"}
              handleCheckedChange={handleCheckedChange}
              enabledBenefits={benefits}
              benefits={organizationBenefits.filter(
                (benefit) => benefit.type === type
              )}
            />
          ))}
      </div>
      <p className="text-[10px] dark:text-neutral-600 text-neutral-400 text-center">
        Visit your{" "}
        <a
          href={`${baseUrl}/dashboard/${organization?.slug}`}
          target="_blank"
          rel="noreferrer"
          className="dark:text-white text-blue-500"
        >
          Polar Dashboard
        </a>{" "}
        to configure more benefits like GitHub Repositories & Discord Channels
      </p>
    </div>
  );
};

interface BenefitsContainerProps {
  title: string;
  benefits: Benefit[];
  enabledBenefits: Benefit[];
  handleCheckedChange: (benefit: Benefit) => (checked: boolean) => void;
  type: "license_keys" | "downloadables" | "custom";
}

const BenefitsContainer = ({
  title,
  benefits,
  enabledBenefits,
  handleCheckedChange,
  type,
}: BenefitsContainerProps) => {
  const hasEnabledBenefits = benefits.some((benefit) => {
    return enabledBenefits.some((b) => b.id === benefit.id);
  });
  const [open, setOpen] = useState(false);
  const { organization } = useContext(OrganizationContext);
  const [isLoading, setIsLoading] = useState(false);
  const [createBenefitSection, setCreateBenefitSection] =
    useState<BenefitType>();

  const createBenefit = useCreateBenefit(organization?.id);

  const handleToggleNewBenefit = (type: BenefitType) => {
    setCreateBenefitSection(type);
  };

  const form = useForm<BenefitCreate>({
    defaultValues: {
      organizationId: organization?.id ?? "",
      type: type ? type : "custom",
      isTaxApplicable: true,
    },
  });

  const { handleSubmit } = form;

  const handleCreateNewBenefit = useCallback(
    async (subscriptionBenefitCreate: BenefitCreate) => {
      try {
        setIsLoading(true);
        const benefit = await createBenefit.mutateAsync(
          subscriptionBenefitCreate
        );

        if (benefit) {
          setCreateBenefitSection(undefined);
        }
      } finally {
        setIsLoading(false);
      }
    },
    [createBenefit, setCreateBenefitSection]
  );

  if (!organization) {
    return null;
  }

  return (
    <div className="flex flex-col gap-1">
      <div
        className={twMerge(
          "hover:dark:border-neutral-800 hover:bg-neutral-100 group select-none flex cursor-pointer flex-row items-center justify-between gap-2 rounded-lg border px-3 py-2 text-sm transition-colors border-transparent",
          open
            ? "dark:bg-neutral-800 bg-neutral-100"
            : "dark:bg-neutral-900 bg-neutral-50"
        )}
        onClick={() => {
          setOpen((v) => !v);
          setCreateBenefitSection(undefined);
        }}
        role="button"
      >
        <div className="flex flex-row items-center gap-x-3">
          {resolveBenefitCategoryIcon(type, "inherit", "h-4 w-4")}
          <span className="text-xs">{title}</span>
        </div>
        <span className="flex flex-row items-center gap-x-3">
          {hasEnabledBenefits ? (
            <div className="h-1.5 w-1.5 rounded-full bg-blue-500" />
          ) : null}
          <span className="text-neutral-500 font-mono text-xs">
            {benefits.length}
          </span>
          {open ? (
            <ChevronUpIcon className="h-4 w-4 opacity-30 group-hover:opacity-100 transition-opacity" />
          ) : (
            <ChevronDownIcon className="h-4 w-4 opacity-30 group-hover:opacity-100 transition-opacity" />
          )}
        </span>
      </div>
      {open && !createBenefitSection ? (
        <div className="dark:border-neutral-800 border-neutral-100 mb-2 flex flex-col gap-y-4 rounded-lg border p-2 pt-3">
          {benefits.length > 0 ? (
            <div className="flex flex-col gap-y-1">
              {benefits.map((benefit) => {
                return (
                  <BenefitRow
                    key={benefit.id}
                    organization={organization}
                    benefit={benefit}
                    checked={enabledBenefits.some((b) => b.id === benefit.id)}
                    onCheckedChange={handleCheckedChange(benefit)}
                  />
                );
              })}
            </div>
          ) : (
            <div className="flex flex-col items-center">
              <p className="text-neutral-500 text-xs text-center">
                You haven&apos;t configured any {title}
              </p>
            </div>
          )}
          <Button
            className="rounded-lg flex flex-row items-center gap-x-2 shadow-none hover:bg-neutral-200 dark:hover:bg-neutral-700"
            variant="secondary"
            onClick={() => handleToggleNewBenefit(type)}
            type="button"
            size="sm"
          >
            <AddOutlined fontSize="inherit" />
            <span>Create New</span>
          </Button>
        </div>
      ) : null}
      {open && createBenefitSection ? (
        <div className="flex flex-col gap-y-4 dark:border-neutral-800 rounded-xl border p-4">
          <Form {...form}>
            <form className="flex flex-col gap-y-4">
              <BenefitForm
                organization={organization}
                type={createBenefitSection}
              />
            </form>
          </Form>
          <div className="flex flex-col items-center gap-y-2">
            <Button
              className="rounded-full"
              disabled={isLoading}
              size="sm"
              onClick={handleSubmit(handleCreateNewBenefit)}
            >
              Create
            </Button>
            <Button
              className="rounded-full"
              variant="ghost"
              size="sm"
              onClick={() => {
                setCreateBenefitSection(undefined);
              }}
            >
              Cancel
            </Button>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default ProductBenefitsForm;
