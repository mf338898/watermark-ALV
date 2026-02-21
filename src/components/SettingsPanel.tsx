import { useState } from 'react';
import { PRIMARY_COLOR } from '../config';
import type { WatermarkOptions, Position, WatermarkMode } from '../config';

const POSITIONS: Position[] = [
  'top-left',
  'top',
  'top-right',
  'left',
  'center',
  'right',
  'bottom-left',
  'bottom',
  'bottom-right',
];

const POSITION_LABELS: Record<Position, string> = {
  'top-left': '↖',
  top: '↑',
  'top-right': '↗',
  left: '←',
  center: '●',
  right: '→',
  'bottom-left': '↙',
  bottom: '↓',
  'bottom-right': '↘',
};

interface SettingsPanelProps {
  options: WatermarkOptions;
  onChange: (options: WatermarkOptions) => void;
}

export function SettingsPanel({ options, onChange }: SettingsPanelProps) {
  const [open, setOpen] = useState(false);
  const [advancedOpen, setAdvancedOpen] = useState(false);

  const update = (partial: Partial<WatermarkOptions>) => {
    onChange({ ...options, ...partial });
  };

  return (
    <div style={{ marginTop: '1rem' }}>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        style={{
          background: 'none',
          border: 'none',
          color: '#6b7280',
          fontSize: '0.9rem',
          cursor: 'pointer',
          textDecoration: 'underline',
        }}
      >
        {open ? 'Masquer' : 'Paramètres'}
      </button>

      {open && (
        <div
          style={{
            marginTop: '1rem',
            padding: '1rem',
            backgroundColor: '#f9fafb',
            borderRadius: 8,
            border: '1px solid #e5e7eb',
          }}
        >
          {/* Mode */}
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', marginBottom: 4, fontSize: '0.9rem', fontWeight: 500 }}>
              Mode
            </label>
            <div style={{ display: 'flex', gap: 8 }}>
              {(['simple', 'grid'] as WatermarkMode[]).map((mode) => (
                <button
                  key={mode}
                  type="button"
                  onClick={() => update({ mode })}
                  style={{
                    padding: '6px 12px',
                    borderRadius: 6,
                    border: `1px solid ${options.mode === mode ? PRIMARY_COLOR : '#d1d5db'}`,
                    backgroundColor: options.mode === mode ? `${PRIMARY_COLOR}20` : 'white',
                    color: options.mode === mode ? PRIMARY_COLOR : '#374151',
                    cursor: 'pointer',
                    fontSize: '0.9rem',
                  }}
                >
                  {mode === 'simple' ? 'Simple (1 logo)' : 'Grille'}
                </button>
              ))}
            </div>
          </div>

          {options.mode === 'grid' && (
            <>
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: 4, fontSize: '0.9rem' }}>
                  Densité (colonnes × lignes)
                </label>
                <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                  <input
                    type="number"
                    min={1}
                    max={5}
                    value={options.gridCols}
                    onChange={(e) => update({ gridCols: Number(e.target.value) })}
                    style={{ width: 50, padding: 4 }}
                  />
                  <span>×</span>
                  <input
                    type="number"
                    min={1}
                    max={5}
                    value={options.gridRows}
                    onChange={(e) => update({ gridRows: Number(e.target.value) })}
                    style={{ width: 50, padding: 4 }}
                  />
                </div>
              </div>
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: 4, fontSize: '0.9rem' }}>
                  Espacement: {Math.round(options.gridSpacing * 100)}%
                </label>
                <input
                  type="range"
                  min={0}
                  max={50}
                  value={options.gridSpacing * 100}
                  onChange={(e) => update({ gridSpacing: Number(e.target.value) / 100 })}
                  style={{ width: '100%' }}
                />
              </div>
            </>
          )}

          {options.mode === 'simple' && (
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', marginBottom: 4, fontSize: '0.9rem' }}>
                Emplacement
              </label>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(3, 1fr)',
                  gap: 4,
                  maxWidth: 120,
                }}
              >
                {POSITIONS.map((pos) => (
                  <button
                    key={pos}
                    type="button"
                    onClick={() => update({ position: pos })}
                    title={pos}
                    style={{
                      padding: 8,
                      borderRadius: 6,
                      border: `1px solid ${options.position === pos ? PRIMARY_COLOR : '#d1d5db'}`,
                      backgroundColor: options.position === pos ? `${PRIMARY_COLOR}20` : 'white',
                      cursor: 'pointer',
                      fontSize: '1.2rem',
                    }}
                  >
                    {POSITION_LABELS[pos]}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', marginBottom: 4, fontSize: '0.9rem' }}>
              Opacité: {Math.round(options.opacity * 100)}%
            </label>
            <input
              type="range"
              min={0}
              max={100}
              value={options.opacity * 100}
              onChange={(e) => update({ opacity: Number(e.target.value) / 100 })}
              style={{ width: '100%' }}
            />
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', marginBottom: 4, fontSize: '0.9rem' }}>
              Taille: {Math.round(options.size * 100)}% largeur
            </label>
            <input
              type="range"
              min={5}
              max={80}
              value={options.size * 100}
              onChange={(e) => update({ size: Number(e.target.value) / 100 })}
              style={{ width: '100%' }}
            />
          </div>

          {/* Avancé */}
          <div>
            <button
              type="button"
              onClick={() => setAdvancedOpen(!advancedOpen)}
              style={{
                background: 'none',
                border: 'none',
                color: '#6b7280',
                fontSize: '0.85rem',
                cursor: 'pointer',
              }}
            >
              {advancedOpen ? '−' : '+'} Avancé
            </button>
            {advancedOpen && (
              <div style={{ marginTop: 8 }}>
                <label style={{ display: 'block', marginBottom: 4, fontSize: '0.9rem' }}>
                  Rotation: {options.rotation}°
                </label>
                <input
                  type="range"
                  min={0}
                  max={45}
                  value={options.rotation}
                  onChange={(e) => update({ rotation: Number(e.target.value) })}
                  style={{ width: '100%' }}
                />
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
