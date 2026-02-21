/**
 * Configuration - Couleur primaire à fournir manuellement
 * Modifier PRIMARY_COLOR avec le hex de la charte ALV Immobilier
 */
export const PRIMARY_COLOR = '#2563eb';
export const SECONDARY_COLOR = '#1d4ed8'; // Hover / badges

export const DEFAULT_OPACITY = 0.7; // 70%
export const DEFAULT_SIZE = 0.3; // 30% de la largeur
export const DEFAULT_POSITION = 'center' as const; // 9 points: top-left, top, top-right, left, center, right, bottom-left, bottom, bottom-right
export const DEFAULT_ROTATION = 0; // degrés
export const DEFAULT_GRID_COLS = 2;
export const DEFAULT_GRID_ROWS = 2;
export const DEFAULT_GRID_SPACING = 0.1; // 10% de l'image

export const WATERMARK_URL = '/watermark.svg';
export const DEMO_IMAGE_URL = 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800&h=600'; // Cuisine — image démo immobilier (Unsplash, CORS-friendly)

export type Position =
  | 'top-left'
  | 'top'
  | 'top-right'
  | 'left'
  | 'center'
  | 'right'
  | 'bottom-left'
  | 'bottom'
  | 'bottom-right';

export type WatermarkMode = 'simple' | 'grid';

export interface WatermarkOptions {
  mode: WatermarkMode;
  position: Position;
  opacity: number;
  size: number; // 0-1, proportion de la largeur
  rotation: number; // 0-45 degrés
  gridCols: number;
  gridRows: number;
  gridSpacing: number; // 0-1
}

export const defaultWatermarkOptions: WatermarkOptions = {
  mode: 'simple',
  position: DEFAULT_POSITION,
  opacity: 0.7, // 70% par défaut
  size: 0.3, // 30% largeur par défaut
  rotation: DEFAULT_ROTATION,
  gridCols: DEFAULT_GRID_COLS,
  gridRows: DEFAULT_GRID_ROWS,
  gridSpacing: DEFAULT_GRID_SPACING,
};
