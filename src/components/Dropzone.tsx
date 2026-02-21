import { useCallback, useRef } from 'react';
import { PRIMARY_COLOR } from '../config';

interface DropzoneProps {
  onFiles: (files: File[]) => void;
  disabled?: boolean;
}

const ACCEPT = 'image/jpeg,image/png,image/webp';

export function Dropzone({ onFiles, disabled }: DropzoneProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      if (disabled) return;
      const items = Array.from(e.dataTransfer.files).filter((f) =>
        ACCEPT.split(',').some((t) => f.type === t.trim())
      );
      if (items.length) onFiles(items);
    },
    [onFiles, disabled]
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const items = Array.from(e.target.files ?? []);
      if (items.length) onFiles(items);
      e.target.value = '';
    },
    [onFiles]
  );

  const handleClick = useCallback(() => {
    if (disabled) return;
    inputRef.current?.click();
  }, [disabled]);

  return (
    <div
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onClick={handleClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && handleClick()}
      style={{
        border: `2px dashed #d1d5db`,
        borderRadius: 12,
        padding: '3rem 2rem',
        textAlign: 'center',
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.6 : 1,
        transition: 'border-color 0.2s, background 0.2s',
      }}
      className="dropzone"
    >
      <input
        ref={inputRef}
        type="file"
        accept={ACCEPT}
        multiple
        onChange={handleChange}
        style={{ display: 'none' }}
      />
      <p style={{ margin: 0, color: '#6b7280', fontSize: '1rem' }}>
        Glissez-déposez vos photos (JPG/PNG/WebP)
      </p>
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          handleClick();
        }}
        disabled={disabled}
        style={{
          marginTop: '1rem',
          padding: '0.5rem 1.5rem',
          borderRadius: 8,
          border: 'none',
          backgroundColor: PRIMARY_COLOR,
          color: 'white',
          fontSize: '0.95rem',
          cursor: disabled ? 'not-allowed' : 'pointer',
        }}
      >
        Importer
      </button>
    </div>
  );
}
