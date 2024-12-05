import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { useFormContext } from 'react-hook-form'
import { DownloadablesBenefitForm } from './Downloadables/DownloadablesForm'
import { LicenseKeysBenefitForm } from './LicenseKeys/LicenseKeysForm'
import { BenefitCustomCreate, BenefitType } from '@polar-sh/sdk/models/components'
import { BenefitCreate, Organization } from '@polar-sh/sdk/models/components'
import { benefitsDisplayNames } from '@/utils'

export const NewBenefitForm = ({
  organization,
}: {
  organization: Organization
}) => {
  const { watch } = useFormContext<BenefitCreate>()
  const type = watch('type')

  return <BenefitForm organization={organization} type={type} />
}

interface UpdateBenefitFormProps {
  organization: Organization
  type: BenefitType
}

export const UpdateBenefitForm = ({
  organization,
  type,
}: UpdateBenefitFormProps) => {
  return <BenefitForm organization={organization} type={type} update={true} />
}

interface BenefitFormProps {
  organization: Organization
  type: BenefitType
  update?: boolean
}

export const BenefitForm = ({
  organization,
  type,
  update = false,
}: BenefitFormProps) => {
  const { control } = useFormContext<BenefitCreate>()

  return (
    <>
      <FormField
        control={control}
        name="description"
        rules={{
          minLength: {
            value: 3,
            message: 'Description length must be at least 3 characters long',
          },
          maxLength: {
            message: 'Description length must be less than 42 characters long',
            value: 42,
          },
          required: 'This field is required',
        }}
        render={({ field }) => {
          return (
            <FormItem>
              <div className="flex flex-row items-center justify-between">
                <FormLabel>Description</FormLabel>
                <span className="text-neutral-400 text-sm">
                  {field.value?.length ?? 0} / 42
                </span>
              </div>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )
        }}
      />

      {!update ? <BenefitTypeSelect /> : null}
      {type === 'custom' && <CustomBenefitForm update={update} />}
      {type === 'downloadables' && (
        <DownloadablesBenefitForm organization={organization} update={update} />
      )}
      {type === 'license_keys' && <LicenseKeysBenefitForm />}
    </>
  )
}

interface CustomBenefitFormProps {
  update?: boolean
}

export const CustomBenefitForm = ({
  update = false,
}: CustomBenefitFormProps) => {
  const { control } = useFormContext<BenefitCustomCreate>()

  return (
    <>
      <FormField
        control={control}
        name="properties.note"
        render={({ field }) => {
          return (
            <FormItem>
              <div className="flex flex-row items-center justify-between">
                <FormLabel>Private note</FormLabel>
              </div>
              <FormControl>
                <textarea
                  {...field}
                  value={field.value || ''}
                  placeholder="Write a secret note here. Like your private email address for premium support, Cal.com link to book consultation, etc."
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )
        }}
      />
      {!update && (
        <FormField
          control={control}
          name="isTaxApplicable"
          render={({ field }) => {
            return (
              <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                <FormControl>
                  <input
                    type="checkbox"
                    defaultChecked={field.value}
                    onChange={field.onChange}
                  />
                </FormControl>
                <FormLabel className="text-sm leading-none">
                  Tax Applicable
                </FormLabel>
              </FormItem>
            )
          }}
        />
      )}
    </>
  )
}

const BenefitTypeSelect = () => {
  const { control } = useFormContext<BenefitCustomCreate>()
  return (
    <FormField
      control={control}
      name="type"
      shouldUnregister={true}
      render={({ field }) => {
        return (
          <FormItem>
            <div className="flex flex-row items-center justify-between">
              <FormLabel>Type</FormLabel>
            </div>
            <FormControl>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a benefit type" />
                </SelectTrigger>
                <SelectContent>
                  {Object.values(BenefitType)
                    .filter((value) => {
                      switch (value) {
                        case BenefitType.Articles:
                          return false
                        default:
                          return true
                      }
                    })
                    .map((value) => (
                      <SelectItem key={value} value={value}>
                        {benefitsDisplayNames[value]}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </FormControl>
            <FormMessage />
          </FormItem>
        )
      }}
    />
  )
}
