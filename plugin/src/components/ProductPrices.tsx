import {
  ProductPrice,
  ProductPriceType,
  SubscriptionRecurringInterval,
} from '@polar-sh/sdk/models/components'
import { ProductPriceLabel } from './ProductPriceLabel'
import { cn } from '../lib/utils'

interface ProductPricesProps {
  prices: ProductPrice[]
  className?: string
}

export const ProductPrices = ({ prices, className }: ProductPricesProps) => {
  if (prices.length === 0) {
    return <></>
  }

  if (prices.length === 1) {
    const price = prices[0]
    return <ProductPriceLabel className={className} price={price} />
  }

  if (prices.length > 1) {
    const monthlyPrice = prices.find(
      (price) =>
        price.type === ProductPriceType.Recurring &&
        price.recurringInterval === SubscriptionRecurringInterval.Month,
    )
    const yearlyPrice = prices.find(
      (price) =>
        price.type === ProductPriceType.Recurring &&
        price.recurringInterval === SubscriptionRecurringInterval.Year,
    )
    return (
      <div className={cn("flex gap-1", className)}>
        {monthlyPrice && <ProductPriceLabel price={monthlyPrice} />}
        <div>-</div>
        {yearlyPrice && <ProductPriceLabel price={yearlyPrice} />}
      </div>
    )
  }

  return <></>
}