import type { ReactNode } from 'react';

export function Field({
  label,
  required,
  error,
  children,
}: {
  label: string;
  required?: boolean;
  error?: string;
  children: ReactNode;
}) {
  return (
    <div>
      <label className="mb-1.5 block text-sm font-semibold text-mist">
        {label} {required && <span className="text-loam">*</span>}
      </label>
      {children}
      {error && <p className="mt-1 text-xs text-red-700">{error}</p>}
    </div>
  );
}

export const inputClass =
  'w-full rounded-sm border border-border bg-surface px-3.5 py-3 text-sm text-ink focus:border-canopy focus:outline-none';
