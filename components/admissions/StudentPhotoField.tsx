'use client';

import { useEffect, useRef, useState } from 'react';
import { Camera, X } from 'lucide-react';

function initialsOf(firstName: string, lastName: string) {
  const a = firstName?.trim()?.[0] ?? '';
  const b = lastName?.trim()?.[0] ?? '';
  return (a + b).toUpperCase() || '?';
}

export default function StudentPhotoField({
  value,
  onChange,
  firstName,
  lastName,
}: {
  value: File | null;
  onChange: (file: File | null) => void;
  firstName: string;
  lastName: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!value) {
      setPreviewUrl(null);
      return;
    }
    const url = URL.createObjectURL(value);
    setPreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [value]);

  const handleFile = (file: File | null) => {
    onChange(file);
  };

  return (
    <div>
      <label className="mb-1.5 block text-sm font-semibold text-mist">Student Photo</label>
      <div className="flex items-center gap-4">
        <div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-full border border-border bg-paper">
          {previewUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={previewUrl} alt="Student preview" className="h-full w-full object-cover" />
          ) : (
            <span className="font-serif text-xl font-semibold text-canopy">
              {initialsOf(firstName, lastName)}
            </span>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => handleFile(e.target.files?.[0] ?? null)}
          />
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="flex items-center gap-1.5 rounded-sm border border-canopy px-4 py-2 text-sm font-semibold text-canopy hover:bg-canopy hover:text-white"
          >
            <Camera size={15} /> {value ? 'Replace' : 'Upload Photo'}
          </button>
          {value && (
            <button
              type="button"
              onClick={() => {
                handleFile(null);
                if (inputRef.current) inputRef.current.value = '';
              }}
              className="flex items-center gap-1.5 text-xs font-semibold text-red-700"
            >
              <X size={13} /> Remove
            </button>
          )}
        </div>
      </div>
      <p className="mt-2 text-xs italic text-mist">
        Optional — if no photo is uploaded, the student&apos;s initials will be
        used instead.
      </p>
    </div>
  );
}
