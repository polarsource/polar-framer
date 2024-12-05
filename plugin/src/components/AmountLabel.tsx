import { SubscriptionRecurringInterval } from '@polar-sh/sdk/models/components'
import { formatCurrencyAndAmount } from "../utils";
import { useMemo } from "react";
import { cn } from '../lib/utils';

interface AmountLabelProps {
  amount: number
  currency: string;
  interval?: SubscriptionRecurringInterval;
  className?: string;
}

export const AmountLabel = ({
  amount,
  currency,
  interval,
  className,
}: AmountLabelProps) => {
  const intervalDisplay = useMemo(() => {
    if (!interval) {
      return ''
    }

    switch (interval) {
      case SubscriptionRecurringInterval.Month:
        return ' / mo'
      case SubscriptionRecurringInterval.Year:
        return ' / yr'
      default:
        return ''
    }
  }, [interval])

  return (
    <div className={cn("flex flex-row items-baseline", className)}>
      {formatCurrencyAndAmount(amount, currency, 0)}
      <span className="text-[0.5em]">{intervalDisplay}</span>
    </div>
  )
}