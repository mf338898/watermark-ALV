import type { WatermarkOptions, Position } from '../config';

function loadImage(src: string, crossOrigin = false): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    if (crossOrigin) img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error(`Failed to load image: ${src}`));
    img.src = src;
  });
}

function getPositionCoords(
  position: Position,
  imgWidth: number,
  imgHeight: number,
  wmWidth: number,
  wmHeight: number
): { x: number; y: number } {
  const margin = Math.min(imgWidth, imgHeight) * 0.02;
  const positions: Record<Position, { x: number; y: number }> = {
    'top-left': { x: margin, y: margin },
    top: { x: (imgWidth - wmWidth) / 2, y: margin },
    'top-right': { x: imgWidth - wmWidth - margin, y: margin },
    left: { x: margin, y: (imgHeight - wmHeight) / 2 },
    center: { x: (imgWidth - wmWidth) / 2, y: (imgHeight - wmHeight) / 2 },
    right: { x: imgWidth - wmWidth - margin, y: (imgHeight - wmHeight) / 2 },
    'bottom-left': { x: margin, y: imgHeight - wmHeight - margin },
    bottom: { x: (imgWidth - wmWidth) / 2, y: imgHeight - wmHeight - margin },
    'bottom-right': { x: imgWidth - wmWidth - margin, y: imgHeight - wmHeight - margin },
  };
  return positions[position];
}

export async function applyWatermark(
  source: File | string,
  watermarkUrl: string,
  options: WatermarkOptions
): Promise<Blob> {
  const sourceUrl = typeof source === 'string' ? source : URL.createObjectURL(source);
  const sourceImg = await loadImage(sourceUrl, typeof source === 'string');
  const watermarkImg = await loadImage(watermarkUrl);

  const imgWidth = sourceImg.naturalWidth;
  const imgHeight = sourceImg.naturalHeight;

  const canvas = document.createElement('canvas');
  canvas.width = imgWidth;
  canvas.height = imgHeight;
  const ctx = canvas.getContext('2d')!;

  // Draw source image
  ctx.drawImage(sourceImg, 0, 0);

  // Watermark dimensions (size = proportion of width)
  const wmDisplayWidth = imgWidth * options.size;
  const wmAspect = watermarkImg.naturalHeight / watermarkImg.naturalWidth;
  const wmDisplayHeight = wmDisplayWidth * wmAspect;

  ctx.globalAlpha = options.opacity;

  if (options.mode === 'simple') {
    const { x, y } = getPositionCoords(
      options.position,
      imgWidth,
      imgHeight,
      wmDisplayWidth,
      wmDisplayHeight
    );

    ctx.save();
    if (options.rotation !== 0) {
      const cx = x + wmDisplayWidth / 2;
      const cy = y + wmDisplayHeight / 2;
      ctx.translate(cx, cy);
      ctx.rotate((options.rotation * Math.PI) / 180);
      ctx.translate(-cx, -cy);
    }
    ctx.drawImage(watermarkImg, x, y, wmDisplayWidth, wmDisplayHeight);
    ctx.restore();
  } else {
    // Grid mode
    const spacingX = imgWidth * options.gridSpacing;
    const spacingY = imgHeight * options.gridSpacing;
    const totalW = wmDisplayWidth * options.gridCols + spacingX * (options.gridCols - 1);
    const totalH = wmDisplayHeight * options.gridRows + spacingY * (options.gridRows - 1);
    const startX = (imgWidth - totalW) / 2 + spacingX / 2;
    const startY = (imgHeight - totalH) / 2 + spacingY / 2;

    ctx.save();
    if (options.rotation !== 0) {
      ctx.translate(imgWidth / 2, imgHeight / 2);
      ctx.rotate((options.rotation * Math.PI) / 180);
      ctx.translate(-imgWidth / 2, -imgHeight / 2);
    }

    for (let row = 0; row < options.gridRows; row++) {
      for (let col = 0; col < options.gridCols; col++) {
        const x = startX + col * (wmDisplayWidth + spacingX);
        const y = startY + row * (wmDisplayHeight + spacingY);
        ctx.drawImage(watermarkImg, x, y, wmDisplayWidth, wmDisplayHeight);
      }
    }
    ctx.restore();
  }

  ctx.globalAlpha = 1;

  if (typeof source !== 'string') {
    URL.revokeObjectURL(sourceUrl);
  }

  const mime = typeof source === 'string' ? 'image/jpeg' : source.type;
  const outputMime = mime === 'image/webp' ? 'image/webp' : mime === 'image/png' ? 'image/png' : 'image/jpeg';

  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => (blob ? resolve(blob) : reject(new Error('Failed to create blob'))),
      outputMime,
      0.92
    );
  });
}
