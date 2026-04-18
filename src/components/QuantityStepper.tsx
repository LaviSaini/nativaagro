"use client";

type Props = {
  value: number;
  min: number;
  max: number;
  disabled?: boolean;
  onChange: (next: number) => void;
  /** compact = smaller hit targets for dense rows */
  compact?: boolean;
};

export function QuantityStepper({
  value,
  min,
  max,
  disabled,
  onChange,
  compact = false,
}: Props) {
  const pad = compact ? "h-8 w-8 text-sm" : "h-10 w-10 text-base";
  const label = compact ? "text-xs" : "text-sm";

  return (
    <div className={`inline-flex items-center rounded-full border border-zinc-300 bg-white ${compact ? "" : "shadow-sm"}`}>
      <button
        type="button"
        disabled={disabled || value <= min}
        onClick={() => onChange(value - 1)}
        className={`${pad} flex items-center justify-center font-medium text-zinc-700 transition hover:bg-zinc-50 disabled:cursor-not-allowed disabled:opacity-40`}
        aria-label="Decrease quantity"
      >
        −
      </button>
      <span className={`min-w-[2.25rem] select-none text-center font-medium tabular-nums text-zinc-900 ${label}`}>
        {value}
      </span>
      <button
        type="button"
        disabled={disabled || value >= max}
        onClick={() => onChange(value + 1)}
        className={`${pad} flex items-center justify-center font-medium text-zinc-700 transition hover:bg-zinc-50 disabled:cursor-not-allowed disabled:opacity-40`}
        aria-label="Increase quantity"
      >
        +
      </button>
    </div>
  );
}
