import { ProductPrice } from "@polar-sh/sdk/models/components/productprice";
import { AmountLabel } from "./AmountLabel";
import { cn } from "@/lib/utils";
import { ProductPriceType } from "@polar-sh/sdk/models/components/productpricetype";

interface ProductPriceLabelProps {
  price: ProductPrice;
  className?: string;
}

export const ProductPriceLabel = ({
  price,
  className,
}: ProductPriceLabelProps) => {
  if (price.amountType === "fixed") {
    return (
      <AmountLabel
        amount={price.priceAmount}
        currency={price.priceCurrency}
        interval={
          price.type === ProductPriceType.Recurring
            ? price.recurringInterval
            : undefined
        }
        className={className}
      />
    );
  } else if (price.amountType === "custom") {
    return (
      <div className={cn("text-[min(1em,24px)]", className)}>
        Pay what you want
      </div>
    );
  } else {
    return <div className={cn("text-[min(1em,24px)]", className)}>Free</div>;
  }
};
