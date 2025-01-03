import { ChangeEvent, FocusEvent, useCallback, useState } from "react";

interface MoneyInputProps {
  name: string;
  placeholder: number;
  id?: string;
  onChange?: (value: number) => void;
  onBlur?: (e: ChangeEvent<HTMLInputElement>) => void;
  onFocus?: (e: FocusEvent<HTMLInputElement>) => void;
  value?: number;
  className?: string;
  disabled?: boolean;
  preSlot?: React.ReactNode;
  postSlot?: React.ReactNode;
}

const getCents = (value: string): number => {
  let newAmount = Number.parseFloat(value);
  if (isNaN(newAmount)) {
    newAmount = 0;
  }
  // Round to avoid floating point errors
  return Math.round(newAmount * 100);
};

const MoneyInput = ({
  id,
  name,
  value,
  placeholder,
  onChange: _onChange,
  onBlur,
  onFocus,
  disabled,
}: MoneyInputProps) => {
  const [internalValue, setInternalValue] = useState<string | undefined>(
    value ? (value / 100).toFixed(2) : undefined
  );

  const onChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      if (_onChange) {
        _onChange(getCents(e.target.value));
      }
      setInternalValue(e.target.value);
    },
    [_onChange]
  );

  const onInput = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const regex = /^\d+([.,]\d{0,2})?$/;
    if (!regex.test(value)) {
      e.target.value = Number.parseFloat(value).toFixed(2);
    }
  };

  return (
    <div className="flex flex-row flex-grow gap-x-2 items-center">
      <input
        className="flex-grow placeholder:text-neutral-500   "
        type="number"
        step={0.1}
        id={id}
        name={name}
        value={internalValue}
        onChange={onChange}
        onInput={onInput}
        placeholder={placeholder ? `$${placeholder / 100}` : '$0'}
        onBlur={onBlur}
        onFocus={onFocus}
        onWheel={(e) => {
          (e.target as HTMLInputElement).blur();
        }}
        disabled={disabled}
      />
      <span className="text-neutral-500">USD</span>
    </div>
  );
};

export default MoneyInput;
