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
                <FormLabel className='text-xs'>Name</FormLabel>
                <span className="dark:text-neutral-400 text-xs">
                  {field.value?.length ?? 0} / 42
                </span>
              </div>
              <FormControl>
                <input className='dark:bg-neutral-800 text-xs p-2 w-full' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )
        }}
      />

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
                <FormLabel className='text-xs'>Private note</FormLabel>
              </div>
              <FormControl>
                <textarea
                  className='dark:bg-neutral-800 placeholder:text-neutral-500 text-xs p-2 w-full min-h-24'
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
              <FormItem className="flex flex-row items-center space-x-2 space-y-0">
                <FormControl>
                  <input
                    type="checkbox"
                    className='h-8 w-8'
                    defaultChecked={field.value}
                    onChange={field.onChange}
                  />
                </FormControl>
                <FormLabel className="text-xs leading-none">
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