"use client";

import { ErrorMessage } from "@hookform/error-message";
import { ClearOutlined } from "@mui/icons-material";
import {
  useFieldArray,
  UseFieldArrayReturn,
  useFormContext,
} from "react-hook-form";
import { ProductFormType } from "./ProductForm";
import {
  ProductPrice,
  ProductPriceType,
  SubscriptionRecurringInterval,
} from "@polar-sh/sdk/models/components";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { useEffect, useMemo, useState } from "react";
import { Tabs, TabsList, TabsTrigger } from "../ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Button } from "../ui/button";
import MoneyInput from "../MoneyInput";

export interface ProductPriceItemProps {
  index: number;
  fieldArray: UseFieldArrayReturn<ProductFormType, "prices", "id">;
  deletable: boolean;
}

export const ProductPriceItem: React.FC<ProductPriceItemProps> = ({
  index,
  fieldArray,
  deletable,
}) => {
  const { control, register, watch, setValue } =
    useFormContext<ProductFormType>();
  const { remove } = fieldArray;
  const recurringInterval = watch(`prices.${index}.recurringInterval`);

  return (
    <div className="flex items-center gap-2">
      <input type="hidden" {...register(`prices.${index}.recurringInterval`)} />
      <input type="hidden" {...register(`prices.${index}.id`)} />
      <input type="hidden" {...register(`prices.${index}.type`)} />
      <input type="hidden" {...register(`prices.${index}.amountType`)} />
      <FormField
        control={control}
        name={`prices.${index}.priceAmount`}
        rules={{
          required: "This field is required",
          min: { value: 1, message: "Price must be greater than 0" },
        }}
        render={({ field }) => {
          return (
            <FormItem className="grow">
              <div className="flex items-center gap-3">
                {recurringInterval && (
                  <span className="text-xs dark:text-neutral-500 w-16">
                    {recurringInterval === SubscriptionRecurringInterval.Month ? "Monthly" : "Yearly"}
                  </span>
                )}
                <FormControl>
                  <MoneyInput
                    name={field.name}
                    value={field.value}
                    onChange={(v) => {
                      field.onChange(v);
                      setValue(`prices.${index}.id`, "");
                    }}
                    placeholder={0}
                  />
                </FormControl>

                {deletable && (
                  <Button
                    variant="ghost"
                    className="rounded-full h-6 w-6"
                    size="icon"
                    onClick={() => remove(index)}
                  >
                    <ClearOutlined fontSize="inherit" />
                  </Button>
                )}
              </div>
              <FormMessage />
            </FormItem>
          );
        }}
      />
    </div>
  );
};

export interface ProductPriceCustomItemProps {
  index: number;
}

export const ProductPriceCustomItem: React.FC<ProductPriceCustomItemProps> = ({
  index,
}) => {
  const { control, register, setValue } = useFormContext<ProductFormType>();

  return (
    <div className="flex items-center gap-2">
      <input type="hidden" {...register(`prices.${index}.recurringInterval`)} />
      <input type="hidden" {...register(`prices.${index}.id`)} />
      <input type="hidden" {...register(`prices.${index}.type`)} />
      <input type="hidden" {...register(`prices.${index}.amountType`)} />
      <FormField
        control={control}
        name={`prices.${index}.minimumAmount`}
        rules={{
          min: { value: 50, message: "Price must be greater than 0.5" },
        }}
        render={({ field }) => {
          return (
            <FormItem>
              <FormLabel>Minimum amount</FormLabel>
              <FormControl>
                <MoneyInput
                  name={field.name}
                  value={field.value || undefined}
                  onChange={(v) => {
                    field.onChange(v);
                    setValue(`prices.${index}.id`, "");
                  }}
                  placeholder={1000}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          );
        }}
      />
      <FormField
        control={control}
        name={`prices.${index}.presetAmount`}
        rules={{
          min: { value: 50, message: "Price must be greater than 0.5" },
        }}
        render={({ field }) => {
          return (
            <FormItem>
              <FormLabel>Suggested amount</FormLabel>
              <FormControl>
                <MoneyInput
                  name={field.name}
                  value={field.value || undefined}
                  onChange={(v) => {
                    field.onChange(v);
                    setValue(`prices.${index}.id`, "");
                  }}
                  placeholder={5000}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          );
        }}
      />
    </div>
  );
};

export interface ProductPriceFreeItemProps {
  index: number;
}

export const ProductPriceFreeItem: React.FC<ProductPriceFreeItemProps> = ({
  index,
}) => {
  const { register } = useFormContext<ProductFormType>();

  return (
    <>
      <input type="hidden" {...register(`prices.${index}.recurringInterval`)} />
      <input type="hidden" {...register(`prices.${index}.id`)} />
      <input type="hidden" {...register(`prices.${index}.type`)} />
      <input type="hidden" {...register(`prices.${index}.amountType`)} />
    </>
  );
};

export interface ProductPricingSectionProps {
  update?: boolean;
}

export const ProductPricingSection = ({
  update,
}: ProductPricingSectionProps) => {
  const {
    control,
    formState: { errors },
    clearErrors,
  } = useFormContext<ProductFormType>();

  const pricesFieldArray = useFieldArray({
    control,
    name: "prices",
  });
  
  const { fields: prices, append, replace } = pricesFieldArray;

  const hasMonthlyPrice = useMemo(
    () =>
      (prices as ProductPrice[]).some(
        (price) =>
          price.type === "recurring" &&
          price.recurringInterval === SubscriptionRecurringInterval.Month
      ),
    [prices]
  );
  const hasYearlyPrice = useMemo(
    () =>
      (prices as ProductPrice[]).some(
        (price) =>
          price.type === "recurring" &&
          price.recurringInterval === SubscriptionRecurringInterval.Year
      ),
    [prices]
  );

  const [pricingType, setPricingType] = useState<ProductPriceType | undefined>(
    hasMonthlyPrice || hasYearlyPrice
      ? ProductPriceType.Recurring
      : ProductPriceType.OneTime
  );

  const [amountType, setAmountType] = useState<"fixed" | "custom" | "free">(
    () => {
      const initialAmountType = (prices as ProductPrice[])[0]?.amountType;
      return initialAmountType ?? "fixed";
    }
 );

  useEffect(() => {
    if (update) return;

    if (pricingType === ProductPriceType.OneTime) {
      if (amountType === "fixed") {
        replace([
          {
            type: "one_time",
            amountType: "fixed",
            priceCurrency: "usd",
            priceAmount: 0,
          },
        ]);
      } else if (amountType === "custom") {
        replace([
          {
            type: "one_time",
            amountType: "custom",
            priceCurrency: "usd",
          },
        ]);
      } else {
        replace([
          {
            type: "one_time",
            amountType: "free",
          },
        ]);
      }
    } else if (pricingType === ProductPriceType.Recurring) {
      if (amountType === "fixed") {
        replace([
          {
            type: "recurring",
            amountType: "fixed",
            recurringInterval: SubscriptionRecurringInterval.Month,
            priceCurrency: "usd",
            priceAmount: 0,
          },
        ]);
      } else if (amountType === "free") {
        replace([
          {
            type: "recurring",
            amountType: "free",
            recurringInterval: SubscriptionRecurringInterval.Month,
          },
        ]);
      } else {
        setAmountType("fixed");
      }
    }
  }, [update, pricingType, replace, amountType]);

  if (update && amountType === "free") {
    return null;
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-y-2">
        <h2 className="text-sm font-semibold">Pricing</h2>
        <p className="text-xs dark:text-neutral-500">
          Set a one-time price, recurring price or a “pay what you want” pricing
          model
        </p>
      </div>
      <div className="flex flex-col gap-6">
        {!update && (
          <Tabs
            value={pricingType}
            onValueChange={(value: string) =>
              setPricingType(value as ProductPriceType)
            }
          >
            <TabsList className="w-full flex flex-row gap-x-1">
              <TabsTrigger
                className="text-xs flex-1"
                value={ProductPriceType.OneTime}
              >
                Pay Once
              </TabsTrigger>
              <TabsTrigger
                className="text-xs flex-1"
                value={ProductPriceType.Recurring}
              >
                Subscription
              </TabsTrigger>
            </TabsList>
          </Tabs>
        )}
        {!update && (
          <Select
            value={amountType}
            onValueChange={(value) =>
              setAmountType(value as "fixed" | "custom" | "free")
            }
          >
            <SelectTrigger className="dark:bg-neutral-900 text-xs    ">
              <SelectValue placeholder="Select a product" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="fixed" className="text-xs">Fixed price</SelectItem>
              {pricingType === ProductPriceType.OneTime && (
                <SelectItem value="custom" className="text-xs">Pay what you want</SelectItem>
              )}
              <SelectItem value="free" className="text-xs">Free</SelectItem>
            </SelectContent>
          </Select>
        )}
        <div className="flex flex-col gap-2">
          {prices.map((price, index) => (
            <>
            {amountType === "fixed" && (
              <ProductPriceItem
                key={price.id}
                index={index}
                fieldArray={pricesFieldArray}
                deletable={pricingType === ProductPriceType.Recurring}
              />
            )}
            {amountType === "custom" && (
              <ProductPriceCustomItem key={price.id} index={index} />
            )}
            {amountType === "free" && (
              <ProductPriceFreeItem key={price.id} index={index} />
              )}
            </>
          ))}
        </div>
        {amountType !== "free" &&
          pricingType === ProductPriceType.Recurring && (
            <div className="flex flex-row gap-2">
              {!hasMonthlyPrice && (
                <Button
                  size="sm"
                  variant="secondary"
                  className="self-start"
                  type="button"
                  onClick={() => {
                    append({
                      type: "recurring",
                      amountType: "fixed",
                      recurringInterval: SubscriptionRecurringInterval.Month,
                      priceCurrency: "usd",
                      priceAmount: 0,
                    });
                    clearErrors("prices");
                  }}
                >
                  Add monthly pricing
                </Button>
              )}
              {!hasYearlyPrice && (
                <Button
                  size="sm"
                  variant="secondary"
                  className="self-start"
                  type="button"
                  onClick={() => {
                    append({
                      type: "recurring",
                      amountType: "fixed",
                      recurringInterval: SubscriptionRecurringInterval.Year,
                      priceCurrency: "usd",
                      priceAmount: 0,
                    });
                    clearErrors("prices");
                  }}
                >
                  Add yearly pricing
                </Button>
              )}
            </div>
          )}
        <ErrorMessage
          errors={errors}
          name="prices"
          render={({ message }) => (
            <p className="text-destructive text-sm font-medium">{message}</p>
          )}
        />
      </div>
    </div>
  );
};
