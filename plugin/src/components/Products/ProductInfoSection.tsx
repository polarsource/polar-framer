'use client'

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { useFormContext } from 'react-hook-form'
import { ProductFormType } from './ProductForm'

export interface ProductInfoSectionProps {
  className?: string
}

export const ProductInfoSection = () => {
  const { control } = useFormContext<ProductFormType>()

  return (
    <div className="flex flex-col gap-y-6">
      <div className="flex flex-col gap-y-2">
        <h2 className="text-sm font-semibold">Product</h2>
        <p className="text-xs dark:text-neutral-500">
          Basic product information which helps identify the product
        </p>
      </div>
      <div className="flex w-full flex-col gap-y-4">
        <FormField
          control={control}
          name="name"
          rules={{
            required: 'This field is required',
            minLength: 3,
          }}
          defaultValue=""
          render={({ field }) => (
            <FormItem className='space-y-0 gap-y-1 flex flex-col'>
              <div className="flex flex-row items-center justify-between">
                <FormLabel className='text-xs'>Name</FormLabel>
              </div>
              <FormControl>
                <input className='px-2 w-full' {...field} value={field.value || ''} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name="description"
          render={({ field }) => (
            <FormItem className="flex flex-col gap-y-1 space-y-0">
              <div className="flex flex-row items-center justify-between">
                <FormLabel className='text-xs'>Description</FormLabel>
              </div>
              <FormControl>
                <textarea
                  className="min-h-24 w-full resize-none p-2"
                  {...field}
                  value={field.value || ''}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  )
}
