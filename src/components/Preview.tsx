import { useState, useEffect } from 'react';
import { DEMO_IMAGE_URL } from '../config';
import type { ProcessedFile } from '../hooks/useWatermark';

interface PreviewProps {
  processed: ProcessedFile[];
  demoBlob: Blob | null;
  demoLoading: boolean;
}

export function Preview({ processed, demoBlob, demoLoading }: PreviewProps) {
  const [slider, setSlider] = useState(50);
  const [beforeUrl, setBeforeUrl] = useState<string | null>(null);
  const [afterUrl, setAfterUrl] = useState<string | null>(null);

  useEffect(() => {
    if (processed.length > 0) {
      const first = processed[0];
      setBeforeUrl(first.beforeUrl);
      setAfterUrl(first.afterUrl);
    } else {
      setBeforeUrl(null);
      setAfterUrl(null);
    }
  }, [processed]);

  const showDemo = processed.length === 0;
  const [demoAfterUrl, setDemoAfterUrl] = useState<string | null>(null);

  useEffect(() => {
    if (demoBlob) {
      const url = URL.createObjectURL(demoBlob);
      setDemoAfterUrl(url);
      return () => URL.revokeObjectURL(url);
    }
    setDemoAfterUrl(null);
  }, [demoBlob]);

  const leftImg = showDemo ? DEMO_IMAGE_URL : beforeUrl;
  const rightImg = showDemo ? demoAfterUrl : afterUrl;

  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        aspectRatio: '4/3',
        maxHeight: 400,
        borderRadius: 12,
        overflow: 'hidden',
        backgroundColor: '#e5e7eb',
      }}
    >
      {showDemo && (demoLoading || !rightImg) ? (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100%',
            color: '#6b7280',
          }}
        >
          {demoLoading ? "Chargement de l'aperçu…" : "Aperçu démo indisponible"}
        </div>
      ) : (
        <>
          {/* Avant */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              clipPath: `inset(0 ${100 - slider}% 0 0)`,
            }}
          >
            <img
              src={leftImg ?? undefined}
              alt="Avant"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'contain',
              }}
              crossOrigin={showDemo ? 'anonymous' : undefined}
            />
          </div>
          {/* Après */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              clipPath: `inset(0 0 0 ${slider}%)`,
            }}
          >
            <img
              src={rightImg ?? undefined}
              alt="Après"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'contain',
              }}
            />
          </div>
          {/* Slider handle */}
          <div
            style={{
              position: 'absolute',
              left: `${slider}%`,
              top: 0,
              bottom: 0,
              width: 4,
              backgroundColor: 'white',
              boxShadow: '0 0 8px rgba(0,0,0,0.3)',
              cursor: 'ew-resize',
            }}
          />
          <input
            type="range"
            min={0}
            max={100}
            value={slider}
            onChange={(e) => setSlider(Number(e.target.value))}
            style={{
              position: 'absolute',
              inset: 0,
              width: '100%',
              height: '100%',
              opacity: 0,
              cursor: 'ew-resize',
            }}
          />
          <div
            style={{
              position: 'absolute',
              top: 8,
              left: 8,
              display: 'flex',
              gap: 8,
            }}
          >
            <span
              style={{
                padding: '4px 8px',
                borderRadius: 4,
                backgroundColor: 'rgba(0,0,0,0.5)',
                color: 'white',
                fontSize: 12,
              }}
            >
              Avant
            </span>
            <span
              style={{
                padding: '4px 8px',
                borderRadius: 4,
                backgroundColor: 'rgba(0,0,0,0.5)',
                color: 'white',
                fontSize: 12,
              }}
            >
              Après
            </span>
          </div>
        </>
      )}
    </div>
  );
}
