import { PRIMARY_COLOR } from '../config';

interface DownloadButtonProps {
  onClick: () => void;
  disabled: boolean;
  progress: { current: number; total: number } | null;
  fileCount: number;
}

export function DownloadButton({
  onClick,
  disabled,
  progress,
}: DownloadButtonProps) {
  const isProcessing = progress !== null;

  return (
    <div style={{ marginTop: '1rem' }}>
      <button
        type="button"
        onClick={onClick}
        disabled={disabled}
        style={{
          width: '100%',
          padding: '0.75rem 1.5rem',
          borderRadius: 8,
          border: 'none',
          backgroundColor: disabled ? '#d1d5db' : PRIMARY_COLOR,
          color: 'white',
          fontSize: '1rem',
          fontWeight: 600,
          cursor: disabled ? 'not-allowed' : 'pointer',
          transition: 'background-color 0.2s',
        }}
      >
        {isProcessing
          ? `Traitement ${progress!.current}/${progress!.total}…`
          : 'Télécharger le ZIP'}
      </button>
    </div>
  );
}
