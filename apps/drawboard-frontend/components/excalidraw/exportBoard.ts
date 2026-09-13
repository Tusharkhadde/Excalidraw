import type { Shape } from "@repo/common/types";

/** Inclusive bounding box of every drawable shape, in canvas coordinates. */
type Bounds = { minX: number; minY: number; maxX: number; maxY: number };

const FALLBACK: Bounds = { minX: 0, minY: 0, maxX: 1200, maxY: 800 };

function escapeXml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/** Shapes can be drawn with negative width/height, so normalise before measuring. */
function rectBounds(x: number, y: number, w: number, h: number): Bounds {
  return {
    minX: Math.min(x, x + w),
    minY: Math.min(y, y + h),
    maxX: Math.max(x, x + w),
    maxY: Math.max(y, y + h),
  };
}

function shapeBounds(shape: Shape): Bounds | null {
  const x = "x" in shape && typeof shape.x === "number" ? shape.x : 0;
  const y = "y" in shape && typeof shape.y === "number" ? shape.y : 0;

  switch (shape.type) {
    case "rect":
    case "diamond":
    case "ellipse":
    case "arrow":
    case "line":
    case "image":
      return rectBounds(x, y, shape.width, shape.height);
    case "circle":
      return {
        minX: shape.centerX - Math.abs(shape.radius),
        minY: shape.centerY - Math.abs(shape.radius),
        maxX: shape.centerX + Math.abs(shape.radius),
        maxY: shape.centerY + Math.abs(shape.radius),
      };
    case "pencil": {
      const points = Array.isArray(shape.points) ? shape.points : [];
      if (!points.length) return null;
      const xs = points.map((p) => p.x);
      const ys = points.map((p) => p.y);
      return {
        minX: Math.min(...xs),
        minY: Math.min(...ys),
        maxX: Math.max(...xs),
        maxY: Math.max(...ys),
      };
    }
    case "text": {
      const size = shape.fontSize || 32;
      const lines = shape.text.split("\n");
      const widest = lines.reduce((max, line) => Math.max(max, line.length), 0);
      return rectBounds(x, y - size, widest * size * 0.55, lines.length * size * 1.25);
    }
    default:
      return null;
  }
}

function unionBounds(shapes: Shape[]): Bounds {
  let result: Bounds | null = null;
  for (const shape of shapes) {
    const next = shapeBounds(shape);
    if (!next) continue;
    result = result
      ? {
          minX: Math.min(result.minX, next.minX),
          minY: Math.min(result.minY, next.minY),
          maxX: Math.max(result.maxX, next.maxX),
          maxY: Math.max(result.maxY, next.maxY),
        }
      : next;
  }
  return result ?? FALLBACK;
}

function shapeToSvg(shape: Shape): string {
  const stroke = shape.strokeColor || "#1e1e1e";
  const strokeWidth = shape.strokeWidth ?? 2;
  const fill = shape.fillColor && shape.fillColor !== "transparent" ? shape.fillColor : "none";
  const strokeAttrs = `stroke="${stroke}" stroke-width="${strokeWidth}" stroke-linecap="round" stroke-linejoin="round"`;

  switch (shape.type) {
    case "rect":
      return `<rect x="${Math.min(shape.x, shape.x + shape.width)}" y="${Math.min(shape.y, shape.y + shape.height)}" width="${Math.abs(shape.width)}" height="${Math.abs(shape.height)}" fill="${fill}" ${strokeAttrs} />`;
    case "circle":
      return `<circle cx="${shape.centerX}" cy="${shape.centerY}" r="${Math.abs(shape.radius)}" fill="${fill}" ${strokeAttrs} />`;
    case "ellipse": {
      const rx = Math.abs(shape.width / 2);
      const ry = Math.abs(shape.height / 2);
      return `<ellipse cx="${shape.x + shape.width / 2}" cy="${shape.y + shape.height / 2}" rx="${rx}" ry="${ry}" fill="${fill}" ${strokeAttrs} />`;
    }
    case "diamond": {
      const cx = shape.x + shape.width / 2;
      const cy = shape.y + shape.height / 2;
      return `<polygon points="${cx},${shape.y} ${shape.x + shape.width},${cy} ${cx},${shape.y + shape.height} ${shape.x},${cy}" fill="${fill}" ${strokeAttrs} />`;
    }
    case "line":
      return `<line x1="${shape.x}" y1="${shape.y}" x2="${shape.x + shape.width}" y2="${shape.y + shape.height}" ${strokeAttrs} />`;
    case "arrow": {
      const x2 = shape.x + shape.width;
      const y2 = shape.y + shape.height;
      const angle = Math.atan2(shape.height, shape.width);
      const head = Math.max(10, strokeWidth * 4);
      const a1 = angle + Math.PI - 0.4;
      const a2 = angle + Math.PI + 0.4;
      return [
        `<line x1="${shape.x}" y1="${shape.y}" x2="${x2}" y2="${y2}" ${strokeAttrs} />`,
        `<path d="M${x2} ${y2} L${x2 + head * Math.cos(a1)} ${y2 + head * Math.sin(a1)} M${x2} ${y2} L${x2 + head * Math.cos(a2)} ${y2 + head * Math.sin(a2)}" fill="none" ${strokeAttrs} />`,
      ].join("");
    }
    case "pencil": {
      const points = Array.isArray(shape.points) ? shape.points : [];
      if (points.length < 2) return "";
      const d = points.map((p, i) => `${i === 0 ? "M" : "L"}${p.x} ${p.y}`).join(" ");
      return `<path d="${d}" fill="none" ${strokeAttrs} />`;
    }
    case "text": {
      const size = shape.fontSize || 32;
      const color = shape.strokeColor || "#1e1e1e";
      const lines = shape.text.split("\n");
      const spans = lines
        .map((line, i) => `<tspan x="${shape.x}" dy="${i === 0 ? 0 : size * 1.25}">${escapeXml(line)}</tspan>`)
        .join("");
      return `<text x="${shape.x}" y="${shape.y}" font-size="${size}" fill="${color}" font-family="'Comic Sans MS','Comic Sans','Chalkboard SE','Comic Neue',cursive">${spans}</text>`;
    }
    case "image":
      return `<image href="${shape.src}" x="${shape.x}" y="${shape.y}" width="${Math.abs(shape.width)}" height="${Math.abs(shape.height)}" />`;
    default:
      return "";
  }
}

/** Serialise shapes into a standalone SVG document cropped to the drawing. */
export function shapesToSvg(shapes: Shape[], background = "#ffffff"): string {
  const pad = 40;
  const bounds = unionBounds(shapes);
  const x = bounds.minX - pad;
  const y = bounds.minY - pad;
  const width = Math.max(1, bounds.maxX - bounds.minX + pad * 2);
  const height = Math.max(1, bounds.maxY - bounds.minY + pad * 2);
  const body = shapes.map(shapeToSvg).join("\n");

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${x} ${y} ${width} ${height}" width="${Math.round(width)}" height="${Math.round(height)}">
<rect x="${x}" y="${y}" width="${width}" height="${height}" fill="${background}" />
${body}
</svg>`;
}

/** Rasterise the live board, compositing a solid background so exports are not transparent. */
export function canvasToPngDataUrl(source: HTMLCanvasElement, background = "#ffffff"): string {
  const output = document.createElement("canvas");
  output.width = source.width;
  output.height = source.height;
  const ctx = output.getContext("2d");
  if (!ctx) return source.toDataURL("image/png");
  ctx.fillStyle = background;
  ctx.fillRect(0, 0, output.width, output.height);
  ctx.drawImage(source, 0, 0);
  return output.toDataURL("image/png");
}

function triggerDownload(href: string, filename: string) {
  const link = document.createElement("a");
  link.href = href;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
}

function safeName(name: string): string {
  return name.trim().replace(/[^a-z0-9-]+/gi, "-").replace(/^-+|-+$/g, "").toLowerCase() || "drawboard";
}

export function exportPng(source: HTMLCanvasElement, name: string, background = "#ffffff") {
  triggerDownload(canvasToPngDataUrl(source, background), `${safeName(name)}.png`);
}

export function exportSvg(shapes: Shape[], name: string, background = "#ffffff") {
  const blob = new Blob([shapesToSvg(shapes, background)], { type: "image/svg+xml;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  triggerDownload(url, `${safeName(name)}.svg`);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}


