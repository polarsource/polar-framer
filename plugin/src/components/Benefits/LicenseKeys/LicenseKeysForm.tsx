"use client";

import {
  BenefitLicenseKeyActivationProperties,
  BenefitLicenseKeyExpirationProperties,
  BenefitLicenseKeysCreate,
} from "@polar-sh/sdk/models/components";
import { Switch } from "@/components/ui/switch";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useState } from "react";
import { useFormContext } from "react-hook-form";

export const LicenseKeysBenefitForm = () => {
  const { control, watch, setValue } =
    useFormContext<BenefitLicenseKeysCreate>();

  const expires = watch("properties.expires", undefined);
  const showExpirationFields = !!expires;
  const defaultExpiration: BenefitLicenseKeyExpirationProperties = {
    ttl: 1,
    timeframe: "year",
  };

  const activations = watch("properties.activations", undefined);
  const showActivationFields = !!activations;
  const defaultActivations: BenefitLicenseKeyActivationProperties = {
    limit: 5,
    enableUserAdmin: true,
  };

  const limitUsage = watch("properties.limitUsage", undefined);
  const [showLimitUsage, setShowLimitUsage] = useState(!!limitUsage);

  return (
    <>
      <FormField
        control={control}
        name="properties.prefix"
        render={({ field }) => {
          const value = field.value || "";
          return (
            <FormItem className="flex flex-col">
              <div className="flex flex-col gap-y-1">
                <FormLabel className="text-xs">Key prefix</FormLabel>
                <FormDescription className="text-xs">
                  A prefix to identify license keys
                </FormDescription>
              </div>
              <FormControl>
                <input
                  className="bg-neutral-800 placeholder:text-neutral-500 text-xs p-2 w-full"
                  type="text"
                  {...{ ...field, value }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          );
        }}
      />

      <div className="flex flex-row items-center">
        <div className="grow">
          <label htmlFor="license-key-ttl">Expires</label>
        </div>
        <FormField
          control={control}
          name="properties.expires"
          render={() => {
            return (
              <FormItem>
                <Switch
                  id="license-key-ttl"
                  className="p-0.5 h-4 w-8 [&>span]:h-3 [&>span]:w-3"
                  checked={showExpirationFields}
                  onCheckedChange={(enabled) => {
                    const value = enabled ? defaultExpiration : undefined;
                    setValue("properties.expires", value);
                  }}
                />
                <FormMessage />
              </FormItem>
            );
          }}
        />
      </div>
      {expires && (
        <div className="flex flex-row gap-x-2">
          <FormField
            control={control}
            name="properties.expires.ttl"
            render={({ field }) => {
              return (
                <FormItem>
                  <FormControl>
                    <input
                      className="bg-neutral-800 placeholder:text-neutral-500 text-xs p-2 w-full"
                      type="number"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              );
            }}
          />
          <FormField
            control={control}
            name="properties.expires.timeframe"
            shouldUnregister={true}
            render={({ field }) => {
              return (
                <FormItem>
                  <FormControl>
                    <select
                      className="bg-neutral-800 text-xs px-3 w-full"
                      value={field.value}
                      onChange={(e) => field.onChange(e.target.value)}
                    >
                      <option value="" disabled>
                        Timeframe
                      </option>
                      <option value="day">Day</option>
                      <option value="month">Month</option>
                      <option value="year">Year</option>
                    </select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              );
            }}
          />
        </div>
      )}

      <div className="flex flex-row items-center">
        <div className="grow">
          <label htmlFor="license-key-activations">Limit Activations</label>
        </div>
        <Switch
          id="license-key-activations"
          className="p-0.5 h-4 w-8 [&>span]:h-3 [&>span]:w-3"
          checked={showActivationFields}
          onCheckedChange={(enabled) => {
            const value = enabled ? defaultActivations : undefined;
            setValue("properties.activations", value);
          }}
        />
      </div>
      {activations && (
        <>
          <FormField
            control={control}
            name="properties.activations.limit"
            render={({ field }) => {
              return (
                <FormItem>
                  <FormControl>
                    <input
                      className="bg-neutral-800 placeholder:text-neutral-500 text-xs p-2 w-full"
                      type="number"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              );
            }}
          />

          <div className="flex flex-row items-center gap-x-3">
            <FormField
              control={control}
              name="properties.activations.enableUserAdmin"
              render={({ field }) => {
                return (
                  <FormItem>
                    <input
                      type="checkbox"
                      id="license-key-activations-user-admin"
                      checked={field.value}
                      onChange={(e) => {
                        // String | boolean type for some reason
                        const value = e.target.checked ? true : false;
                        setValue(
                          "properties.activations.enableUserAdmin",
                          value
                        );
                      }}
                    />
                    <FormMessage />
                  </FormItem>
                );
              }}
            />
            <label
              htmlFor="license-key-activations-user-admin"
              className="text-xs"
            >
              Enable user to deactivate instances via Polar
            </label>
          </div>
        </>
      )}

      <div className="flex flex-row items-center">
        <div className="grow">
          <label htmlFor="license-key-limit-usage">Limit Usage</label>
        </div>
        <Switch
          id="license-key-limit-usage"
          className="p-0.5 h-4 w-8 [&>span]:h-3 [&>span]:w-3"
          checked={showLimitUsage}
          onCheckedChange={(show) => {
            const value = show ? 1 : undefined;
            setValue("properties.limitUsage", value);
            setShowLimitUsage(show);
          }}
        />
      </div>
      {showLimitUsage && (
        <>
          <FormField
            control={control}
            name="properties.limitUsage"
            render={({ field }) => {
              const value = field.value || "";
              return (
                <FormItem>
                  <FormControl>
                    <input
                      className="bg-neutral-800 placeholder:text-neutral-500 text-xs p-2 w-full"
                      type="number"
                      {...{ ...field, value }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              );
            }}
          />
        </>
      )}
    </>
  );
};
