import { Tool } from "@/components/Canvas";
import { getExistingShapes } from "./http";
import type { Shape } from "@repo/common/types";

const STROKE_COLOR = "#1e1e1e";
const STROKE_WIDTH = 2;
const FONT_SIZE = 20;
const HANDLE_SIZE = 8;

function makeId() {
    return "shape_" + Date.now().toString(36) + "_" + Math.random().toString(36).slice(2, 8);
}

function isValidPoint(value: unknown): value is { x: number; y: number } {
    if (!value || typeof value !== "object") return false;
    const point = value as { x?: unknown; y?: unknown };
    return typeof point.x === "number" && typeof point.y === "number";
}

function getSafePencilPoints(shape: Shape): { x: number; y: number }[] {
    if (shape.type !== "pencil" || !Array.isArray(shape.points)) {
        return [];
    }
    return shape.points.filter(isValidPoint);
}

function pointNearLine(px: number, py: number, x1: number, y1: number, x2: number, y2: number, pad: number) {
    const A = px - x1;
    const B = py - y1;
    const C = x2 - x1;
    const D = y2 - y1;
    const dot = A * C + B * D;
    const lenSq = C * C + D * D;
    if (lenSq === 0) return Math.hypot(A, B) <= pad;
    const t = Math.max(0, Math.min(1, dot / lenSq));
    const projX = x1 + t * C;
    const projY = y1 + t * D;
    return Math.hypot(px - projX, py - projY) <= pad;
}

type HandleType = "tl" | "tr" | "bl" | "br" | "tm" | "bm" | "ml" | "mr" | "ec" | "wc" | "nc" | "sc" | null;

interface HandleInfo {
    type: HandleType;
    x: number;
    y: number;
}

function getShapeHandles(shape: Shape): HandleInfo[] {
    const hs: HandleInfo[] = [];
    if (shape.type === "rect") {
        const x = Math.min(shape.x, shape.x + shape.width);
        const y = Math.min(shape.y, shape.y + shape.height);
        const w = Math.abs(shape.width);
        const h = Math.abs(shape.height);
        hs.push({ type: "tl", x, y });
        hs.push({ type: "tr", x: x + w, y });
        hs.push({ type: "bl", x, y: y + h });
        hs.push({ type: "br", x: x + w, y: y + h });
        hs.push({ type: "tm", x: x + w / 2, y });
        hs.push({ type: "bm", x: x + w / 2, y: y + h });
        hs.push({ type: "ml", x, y: y + h / 2 });
        hs.push({ type: "mr", x: x + w, y: y + h / 2 });
    } else if (shape.type === "circle") {
        const cx = shape.centerX;
        const cy = shape.centerY;
        const r = Math.abs(shape.radius);
        hs.push({ type: "nc", x: cx, y: cy - r });
        hs.push({ type: "sc", x: cx, y: cy + r });
        hs.push({ type: "ec", x: cx + r, y: cy });
        hs.push({ type: "wc", x: cx - r, y: cy });
    } else if (shape.type === "diamond") {
        const cx = shape.x + shape.width / 2;
        const cy = shape.y + shape.height / 2;
        const hw = Math.abs(shape.width / 2);
        const hh = Math.abs(shape.height / 2);
        hs.push({ type: "tl", x: cx - hw, y: cy });
        hs.push({ type: "tr", x: cx + hw, y: cy });
        hs.push({ type: "bl", x: cx, y: cy - hh });
        hs.push({ type: "br", x: cx, y: cy + hh });
    } else if (shape.type === "ellipse") {
        const cx = shape.x + shape.width / 2;
        const cy = shape.y + shape.height / 2;
        const rx = Math.abs(shape.width / 2);
        const ry = Math.abs(shape.height / 2);
        hs.push({ type: "nc", x: cx, y: cy - ry });
        hs.push({ type: "sc", x: cx, y: cy + ry });
        hs.push({ type: "ec", x: cx + rx, y: cy });
        hs.push({ type: "wc", x: cx - rx, y: cy });
    } else if (shape.type === "text") {
        const tw = (shape.text?.length || 0) * shape.fontSize * 0.6;
        const th = shape.fontSize * 1.2;
        const tx = shape.x;
        const ty = shape.y - shape.fontSize;
        hs.push({ type: "tl", x: tx, y: ty });
        hs.push({ type: "tr", x: tx + tw, y: ty });
        hs.push({ type: "bl", x: tx, y: ty + th });
        hs.push({ type: "br", x: tx + tw, y: ty + th });
    }
    return hs;
}
export class Game {
    private canvas: HTMLCanvasElement;
    private ctx: CanvasRenderingContext2D;
    private existingShapes: Shape[];
    private roomId: string;
    private clicked = false;
    private startX = 0;
    private startY = 0;
    private selectedTool: Tool = "selection";
    private socket: WebSocket;
    private pencilPath: { x: number; y: number }[] = [];
    private panOffset = { x: 0, y: 0 };
    private zoom = 1;
    private minZoom = 0.1;
    private maxZoom = 5;
    private isPanning = false;
    private panStart = { x: 0, y: 0, offsetX: 0, offsetY: 0 };
    private selectedShapeId: string | null = null;
    private dragOffset = { x: 0, y: 0 };
    private isSpaceDown = false;
    private onTextClick: ((canvasX: number, canvasY: number, screenX: number, screenY: number, editingShape?: Shape) => void) | null = null;
    private onImageClick: (() => void) | null = null;
    private onZoomChange: ((zoom: number) => void) | null = null;

    private isResizing = false;
    private activeHandle: HandleType = null;
    private hoveredShapeId: string | null = null;
    private resizeStart = { x: 0, y: 0, shapeX: 0, shapeY: 0, shapeW: 0, shapeH: 0, shapeFontSize: 0, centerX: 0, centerY: 0, radius: 0 };

    private isErasing = false;
    private erasedIds = new Set<string>();

    private strokeColor: string = STROKE_COLOR;
    private fillColor: string = "transparent";

    private undoStack: Shape[][] = [];
    private redoStack: Shape[][] = [];
    private readonly MAX_UNDO = 50;
    private ignoreUndo = false;

    private boundMouseDown: (e: MouseEvent) => void;
    private boundMouseUp: (e: MouseEvent) => void;
    private boundMouseMove: (e: MouseEvent) => void;
    private boundDblClick: (e: MouseEvent) => void;
    private boundMessage: (event: MessageEvent) => void;
    private boundWheel: (e: WheelEvent) => void;
    private boundKeyDown: (e: KeyboardEvent) => void;
    private boundKeyUp: (e: KeyboardEvent) => void;
    private boundContextMenu: (e: MouseEvent) => void;

    constructor(canvas: HTMLCanvasElement, roomId: string, socket: WebSocket) {
        this.canvas = canvas;
        this.ctx = canvas.getContext("2d")!;
        this.existingShapes = [];
        this.roomId = roomId;
        this.socket = socket;
        this.selectedTool = "selection";

        this.boundMouseDown = this.handleMouseDown.bind(this);
        this.boundMouseUp = this.handleMouseUp.bind(this);
        this.boundMouseMove = this.handleMouseMove.bind(this);
        this.boundDblClick = this.handleDblClick.bind(this);
        this.boundMessage = this.handleMessage.bind(this);
        this.boundWheel = this.handleWheel.bind(this);
        this.boundKeyDown = this.handleKeyDown.bind(this);
        this.boundKeyUp = this.handleKeyUp.bind(this);
        this.boundContextMenu = (e: MouseEvent) => e.preventDefault();

        this.init();
        this.initSocket();
        this.initHandlers();
    }

    destroy() {
        this.canvas.removeEventListener("mousedown", this.boundMouseDown);
        this.canvas.removeEventListener("mouseup", this.boundMouseUp);
        this.canvas.removeEventListener("mousemove", this.boundMouseMove);
        this.canvas.removeEventListener("dblclick", this.boundDblClick);
        this.canvas.removeEventListener("wheel", this.boundWheel);
        this.canvas.removeEventListener("contextmenu", this.boundContextMenu);
        window.removeEventListener("keydown", this.boundKeyDown);
        window.removeEventListener("keyup", this.boundKeyUp);
        this.socket.removeEventListener("message", this.boundMessage);
    }

    setTool(tool: Tool) {
        this.selectedTool = tool;
        if (tool !== "eraser") {
            this.isErasing = false;
            this.erasedIds.clear();
        }
        this.updateCursor();
    }

    setTextClickHandler(handler: ((canvasX: number, canvasY: number, screenX: number, screenY: number, editingShape?: Shape) => void) | null) {
        this.onTextClick = handler;
    }

    cancelEdit(shape: Shape) {
        this.pushUndo();
        this.existingShapes.push(shape);
        this.render();
    }

    setImageClickHandler(handler: (() => void) | null) {
        this.onImageClick = handler;
    }

    setZoomChangeHandler(handler: ((zoom: number) => void) | null) {
        this.onZoomChange = handler;
    }

    setZoom(zoom: number) {
        const newZoom = Math.max(this.minZoom, Math.min(this.maxZoom, zoom));
        if (newZoom !== this.zoom) {
            this.zoom = newZoom;
            this.onZoomChange?.(this.zoom);
            this.render();
        }
    }

    getZoom(): number { return this.zoom; }

    resetZoom() { this.setZoom(1); }

    setCanvasBg(color: string) {
        this.canvasBg = color;
        this.render();
    }

    setStrokeColor(color: string) { this.strokeColor = color; }
    setFillColor(color: string) { this.fillColor = color; }
    getStrokeColor(): string { return this.strokeColor; }
    getFillColor(): string { return this.fillColor; }

    private canvasBg: string = "#ffffff";

    addShape(shape: Shape) {
        this.pushUndo();
        this.existingShapes.push(shape);
        this.render();
    }

    clearShapes() {
        this.pushUndo();
        this.existingShapes = [];
        this.selectedShapeId = null;
        this.render();
    }

    private pushUndo() {
        if (this.ignoreUndo) return;
        this.undoStack.push(JSON.parse(JSON.stringify(this.existingShapes)));
        if (this.undoStack.length > this.MAX_UNDO) this.undoStack.shift();
        this.redoStack = [];
    }

    undo() {
        if (this.undoStack.length === 0) return;
        this.redoStack.push(JSON.parse(JSON.stringify(this.existingShapes)));
        this.existingShapes = this.undoStack.pop()!;
        this.selectedShapeId = null;
        this.render();
        this.socket.send(JSON.stringify({ type: "sync", roomId: this.roomId, shapes: this.existingShapes }));
    }

    redo() {
        if (this.redoStack.length === 0) return;
        this.undoStack.push(JSON.parse(JSON.stringify(this.existingShapes)));
        this.existingShapes = this.redoStack.pop()!;
        this.selectedShapeId = null;
        this.render();
        this.socket.send(JSON.stringify({ type: "sync", roomId: this.roomId, shapes: this.existingShapes }));
    }

    getShapes(): Shape[] { return this.existingShapes; }

    private async init() {
        this.existingShapes = await getExistingShapes(this.roomId);
        this.render();
    }

    private initSocket() {
        this.socket.addEventListener("message", this.boundMessage);
    }

    private initHandlers() {
        this.canvas.addEventListener("mousedown", this.boundMouseDown);
        this.canvas.addEventListener("mouseup", this.boundMouseUp);
        this.canvas.addEventListener("mousemove", this.boundMouseMove);
        this.canvas.addEventListener("dblclick", this.boundDblClick);
        this.canvas.addEventListener("wheel", this.boundWheel, { passive: false });
        this.canvas.addEventListener("contextmenu", this.boundContextMenu);
        window.addEventListener("keydown", this.boundKeyDown);
        window.addEventListener("keyup", this.boundKeyUp);
        this.updateCursor();
    }

    private updateCursor() {
        if (this.isResizing) {
            this.canvas.style.cursor =
                this.activeHandle === "tl" || this.activeHandle === "br" ? "nwse-resize" :
                this.activeHandle === "tr" || this.activeHandle === "bl" ? "nesw-resize" :
                this.activeHandle === "tm" || this.activeHandle === "bm" ? "ns-resize" :
                this.activeHandle === "ml" || this.activeHandle === "mr" ? "ew-resize" :
                this.activeHandle === "ec" || this.activeHandle === "wc" ? "ew-resize" :
                this.activeHandle === "nc" || this.activeHandle === "sc" ? "ns-resize" : "default";
            return;
        }
        const map: Record<string, string> = {
            hand: "grab", rectangle: "crosshair", circle: "crosshair",
            diamond: "crosshair", ellipse: "crosshair", arrow: "crosshair",
            line: "crosshair", pencil: "crosshair", selection: "default",
            text: "text", image: "copy", eraser: "cell",
        };
        this.canvas.style.cursor = map[this.selectedTool] || "default";
    }

    private handleMessage(event: MessageEvent) {
        try {
            const msg = JSON.parse(event.data);
            if (msg.type === "draw" && msg.shape) {
                this.existingShapes.push(msg.shape as Shape);
                this.render();
            } else if (msg.type === "erase" && msg.shapeId) {
                this.existingShapes = this.existingShapes.filter((s) => s.id !== msg.shapeId);
                if (this.selectedShapeId === msg.shapeId) this.selectedShapeId = null;
                this.render();
            } else if (msg.type === "update" && msg.shape) {
                const updated = msg.shape as Shape;
                const idx = this.existingShapes.findIndex((s) => s.id === updated.id);
                if (idx >= 0) {
                    this.existingShapes[idx] = updated;
                    this.render();
                }
            } else if (msg.type === "sync" && Array.isArray(msg.shapes)) {
                this.ignoreUndo = true;
                this.existingShapes = msg.shapes as Shape[];
                this.selectedShapeId = null;
                this.ignoreUndo = false;
                this.render();
            } else if (msg.type === "clear") {
                this.ignoreUndo = true;
                this.existingShapes = [];
                this.selectedShapeId = null;
                this.ignoreUndo = false;
                this.render();
            }
        } catch {
            // ignore malformed messages
        }
    }

    private render() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.fillStyle = this.canvasBg;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.save();
        this.ctx.translate(this.panOffset.x, this.panOffset.y);
        this.ctx.scale(this.zoom, this.zoom);
        for (const shape of this.existingShapes) {
            this.drawShape(shape);
        }
        this.ctx.restore();
    }

    private drawShape(shape: Shape, isPreview: boolean = false) {
        this.ctx.strokeStyle = shape.strokeColor || STROKE_COLOR;
        this.ctx.fillStyle = shape.fillColor || "transparent";
        this.ctx.lineWidth = shape.strokeWidth || STROKE_WIDTH;
        this.ctx.lineCap = "round";
        this.ctx.lineJoin = "round";
        const isSelected: boolean = Boolean(!isPreview && this.selectedShapeId && shape.id === this.selectedShapeId);
        switch (shape.type) {
            case "rect":
                this.drawRectShape(shape.x, shape.y, shape.width, shape.height, isSelected);
                break;
            case "circle":
                this.ctx.beginPath();
                this.ctx.arc(shape.centerX, shape.centerY, Math.abs(shape.radius), 0, Math.PI * 2);
                if (shape.fillColor && shape.fillColor !== "transparent") this.ctx.fill();
                this.ctx.stroke();
                if (isSelected) this.drawSelectionRing(shape.centerX, shape.centerY, Math.abs(shape.radius));
                break;
            case "diamond":
                this.drawDiamond(shape.x, shape.y, shape.width, shape.height, isSelected);
                break;
            case "ellipse":
                this.drawEllipse(shape.x, shape.y, shape.width, shape.height, isSelected);
                break;
            case "arrow":
                this.drawArrow(shape.x, shape.y, shape.width, shape.height, isSelected);
                break;
            case "line":
                this.drawLine(shape.x, shape.y, shape.width, shape.height, isSelected);
                break;
            case "pencil":
                this.drawPencil(getSafePencilPoints(shape), isSelected);
                break;
            case "text":
                this.drawText(shape.x, shape.y, shape.text, shape.fontSize, isSelected, shape.strokeColor);
                break;
            case "image":
                this.drawImage(shape.x, shape.y, shape.width, shape.height, shape.src, isSelected);
                break;
        }
        if (isSelected) this.drawHandles(shape);
    }

    private drawRectShape(x: number, y: number, w: number, h: number, isSelected: boolean) {
        this.ctx.fillRect(x, y, w, h);
        this.ctx.strokeRect(x, y, w, h);
        if (isSelected) this.drawSelectionRing(x + w / 2, y + h / 2, Math.max(Math.abs(w), Math.abs(h)) / 2);
    }

    private drawDiamond(x: number, y: number, w: number, h: number, isSelected: boolean) {
        const cx = x + w / 2, cy = y + h / 2;
        this.ctx.beginPath();
        this.ctx.moveTo(cx, y);
        this.ctx.lineTo(x + w, cy);
        this.ctx.lineTo(cx, y + h);
        this.ctx.lineTo(x, cy);
        this.ctx.closePath();
        this.ctx.fill();
        this.ctx.stroke();
        if (isSelected) this.drawSelectionRing(cx, cy, Math.max(Math.abs(w), Math.abs(h)) / 2);
    }

    private drawEllipse(x: number, y: number, w: number, h: number, isSelected: boolean) {
        const cx = x + w / 2, cy = y + h / 2;
        const rx = Math.abs(w / 2), ry = Math.abs(h / 2);
        this.ctx.beginPath();
        this.ctx.ellipse(cx, cy, rx, ry, 0, 0, Math.PI * 2);
        this.ctx.fill();
        this.ctx.stroke();
        if (isSelected) this.drawSelectionRing(cx, cy, Math.max(rx, ry));
    }

    private drawLine(x: number, y: number, w: number, h: number, isSelected: boolean) {
        this.ctx.beginPath();
        this.ctx.moveTo(x, y);
        this.ctx.lineTo(x + w, y + h);
        this.ctx.stroke();
        if (isSelected) this.drawSelectionRing((x + x + w) / 2, (y + y + h) / 2, Math.hypot(w, h) / 2);
    }

    private drawArrow(x: number, y: number, w: number, h: number, isSelected: boolean) {
        const x2 = x + w, y2 = y + h;
        const angle = Math.atan2(h, w);
        const headLen = 14;
        this.ctx.beginPath();
        this.ctx.moveTo(x, y);
        this.ctx.lineTo(x2, y2);
        this.ctx.stroke();
        this.ctx.save();
        this.ctx.fillStyle = this.strokeColor;
        this.ctx.beginPath();
        this.ctx.moveTo(x2, y2);
        this.ctx.lineTo(x2 - headLen * Math.cos(angle - Math.PI / 6), y2 - headLen * Math.sin(angle - Math.PI / 6));
        this.ctx.lineTo(x2 - headLen * Math.cos(angle + Math.PI / 6), y2 - headLen * Math.sin(angle + Math.PI / 6));
        this.ctx.closePath();
        this.ctx.fill();
        this.ctx.restore();
        if (isSelected) this.drawSelectionRing((x + x2) / 2, (y + y2) / 2, Math.hypot(w, h) / 2);
    }

    private drawPencil(points: { x: number; y: number }[] | undefined, isSelected: boolean) {
        if (!Array.isArray(points) || points.length < 2) return;
        this.ctx.beginPath();
        this.ctx.moveTo(points[0].x, points[0].y);
        for (let i = 1; i < points.length; i++) this.ctx.lineTo(points[i].x, points[i].y);
        this.ctx.stroke();
        if (isSelected) {
            const xs = points.map(p => p.x), ys = points.map(p => p.y);
            const minX = Math.min(...xs), maxX = Math.max(...xs);
            const minY = Math.min(...ys), maxY = Math.max(...ys);
            this.drawSelectionRing((minX + maxX) / 2, (minY + maxY) / 2, Math.max(maxX - minX, maxY - minY) / 2);
        }
    }

    private drawText(x: number, y: number, text: string, fontSize: number, isSelected: boolean, shapeStrokeColor?: string) {
        this.ctx.font = fontSize + 'px "Caveat","Virgil","Segoe UI Emoji",sans-serif';
        this.ctx.fillStyle = shapeStrokeColor || this.strokeColor;
        this.ctx.textBaseline = "alphabetic";
        this.ctx.fillText(text, x, y);
        if (isSelected) {
            const w = this.ctx.measureText(text).width;
            this.ctx.save();
            this.ctx.strokeStyle = "#3b82f6";
            this.ctx.setLineDash([4, 3]);
            this.ctx.lineWidth = 1;
            this.ctx.strokeRect(x - 4, y - fontSize, w + 8, fontSize + 8);
            this.ctx.setLineDash([]);
            this.ctx.restore();
        }
    }

    private drawImage(x: number, y: number, w: number, h: number, src: string, isSelected: boolean) {
        const img = imageCache.get(src);
        if (img && img.complete) this.ctx.drawImage(img, x, y, w, h);
        if (isSelected) {
            this.ctx.save();
            this.ctx.strokeStyle = "#3b82f6";
            this.ctx.setLineDash([4, 3]);
            this.ctx.lineWidth = 1;
            this.ctx.strokeRect(x, y, w, h);
            this.ctx.setLineDash([]);
            this.ctx.restore();
        }
    }

    private drawSelectionRing(cx: number, cy: number, r: number) {
        this.ctx.save();
        this.ctx.strokeStyle = "#3b82f6";
        this.ctx.lineWidth = 1.5;
        this.ctx.setLineDash([4, 3]);
        this.ctx.strokeRect(cx - r - 6, cy - r - 6, (r + 6) * 2, (r + 6) * 2);
        this.ctx.setLineDash([]);
        this.ctx.restore();
    }

    private drawHandles(shape: Shape) {
        const handles = getShapeHandles(shape);
        const hs = HANDLE_SIZE / this.zoom;
        this.ctx.save();
        this.ctx.fillStyle = "#ffffff";
        this.ctx.strokeStyle = "#3b82f6";
        this.ctx.lineWidth = 1.5;
        for (const h of handles) {
            this.ctx.fillRect(h.x - hs / 2, h.y - hs / 2, hs, hs);
            this.ctx.strokeRect(h.x - hs / 2, h.y - hs / 2, hs, hs);
        }
        this.ctx.restore();
    }

    private hitTestHandle(px: number, py: number, shape: Shape): HandleType {
        const handles = getShapeHandles(shape);
        const hs = (HANDLE_SIZE + 4) / this.zoom;
        for (const h of handles) {
            if (px >= h.x - hs / 2 && px <= h.x + hs / 2 && py >= h.y - hs / 2 && py <= h.y + hs / 2) {
                return h.type;
            }
        }
        return null;
    }

    private getMousePos(e: MouseEvent) {
        const rect = this.canvas.getBoundingClientRect();
        return {
            x: (e.clientX - rect.left - this.panOffset.x) / this.zoom,
            y: (e.clientY - rect.top - this.panOffset.y) / this.zoom,
        };
    }

    private hitTest(shape: Shape, px: number, py: number): boolean {
        const pad = 8;
        switch (shape.type) {
            case "rect": {
                const x1 = Math.min(shape.x, shape.x + shape.width);
                const x2 = Math.max(shape.x, shape.x + shape.width);
                const y1 = Math.min(shape.y, shape.y + shape.height);
                const y2 = Math.max(shape.y, shape.y + shape.height);
                return px >= x1 - pad && px <= x2 + pad && py >= y1 - pad && py <= y2 + pad;
            }
            case "circle": {
                const d = Math.hypot(px - shape.centerX, py - shape.centerY);
                return d <= Math.abs(shape.radius) + pad;
            }
            case "diamond": {
                const cx = shape.x + shape.width / 2, cy = shape.y + shape.height / 2;
                const dx = Math.abs(px - cx) / (Math.abs(shape.width / 2) || 1);
                const dy = Math.abs(py - cy) / (Math.abs(shape.height / 2) || 1);
                return dx + dy <= 1;
            }
            case "ellipse": {
                const cx = shape.x + shape.width / 2, cy = shape.y + shape.height / 2;
                const rx = Math.abs(shape.width / 2) || 1, ry = Math.abs(shape.height / 2) || 1;
                const ndx = (px - cx) / rx, ndy = (py - cy) / ry;
                return ndx * ndx + ndy * ndy <= 1;
            }
            case "line":
            case "arrow":
                return pointNearLine(px, py, shape.x, shape.y, shape.x + shape.width, shape.y + shape.height, pad);
            case "pencil": {
                const points = getSafePencilPoints(shape);
                if (points.length > 1) {
                    for (let i = 1; i < points.length; i++) {
                        if (pointNearLine(px, py, points[i - 1].x, points[i - 1].y, points[i].x, points[i].y, pad)) return true;
                    }
                }
                return false;
            }
            case "text": {
                const w = (shape.text?.length || 0) * shape.fontSize * 0.6;
                const h = shape.fontSize * 1.2;
                return px >= shape.x && px <= shape.x + w && py >= shape.y - shape.fontSize && py <= shape.y + h;
            }
            case "image":
                return px >= shape.x && px <= shape.x + shape.width && py >= shape.y && py <= shape.y + shape.height;
        }
    }

    private getShapeStartPoint(shape: Shape): { x: number; y: number } {
        if (shape.type === "circle") return { x: shape.centerX, y: shape.centerY };
        if (shape.type === "pencil") {
            const points = getSafePencilPoints(shape);
            return { x: points[0]?.x ?? 0, y: points[0]?.y ?? 0 };
        }
        return { x: (shape as any).x ?? 0, y: (shape as any).y ?? 0 };
    }

    private handleMouseDown(e: MouseEvent) {
        if (e.button === 2) return;
        const pos = this.getMousePos(e);
        const usePan = this.isSpaceDown || this.selectedTool === "hand";
        if (usePan) {
            this.isPanning = true;
            this.panStart = { x: e.clientX, y: e.clientY, offsetX: this.panOffset.x, offsetY: this.panOffset.y };
            this.updateCursor();
            return;
        }
        if (this.selectedTool === "selection") {
            const hit = [...this.existingShapes].reverse().find((s) => this.hitTest(s, pos.x, pos.y));
            if (hit && hit.id) {
                const handleType = this.hitTestHandle(pos.x, pos.y, hit);
                if (handleType) {
                    this.isResizing = true;
                    this.activeHandle = handleType;
                    this.selectedShapeId = hit.id;
                    const sx = hit.type === "circle" ? hit.centerX : (hit as any).x ?? 0;
                    const sy = hit.type === "circle" ? hit.centerY : (hit as any).y ?? 0;
                    this.resizeStart = {
                        x: pos.x, y: pos.y, shapeX: sx, shapeY: sy,
                        shapeW: (hit as any).width ?? 0, shapeH: (hit as any).height ?? 0,
                        shapeFontSize: hit.type === "text" ? (hit as any).fontSize ?? 32 : 0,
                        centerX: hit.type === "circle" ? hit.centerX : 0,
                        centerY: hit.type === "circle" ? hit.centerY : 0,
                        radius: hit.type === "circle" ? hit.radius : 0,
                    };
                    this.updateCursor();
                    return;
                }
                this.selectedShapeId = hit.id;
                const start = this.getShapeStartPoint(hit);
                this.dragOffset = { x: pos.x - start.x, y: pos.y - start.y };
                this.clicked = true;
            } else {
                this.selectedShapeId = null;
            }
            this.render();
            return;
        }
        if (this.selectedTool === "eraser") {
            this.pushUndo();
            this.isErasing = true;
            this.erasedIds.clear();
            this.eraseAtPoint(pos.x, pos.y);
            return;
        }
        if (this.selectedTool === "text") {
            e.preventDefault();
            const rect = this.canvas.getBoundingClientRect();
            const screenX = pos.x * this.zoom + this.panOffset.x + rect.left;
            const screenY = pos.y * this.zoom + this.panOffset.y + rect.top;
            this.onTextClick?.(pos.x, pos.y, screenX, screenY);
            return;
        }
        if (this.selectedTool === "image") {
            this.onImageClick?.();
            return;
        }
        this.clicked = true;
        this.startX = pos.x;
        this.startY = pos.y;
        if (this.selectedTool === "pencil") this.pencilPath = [{ x: pos.x, y: pos.y }];
    }

    private handleMouseMove(e: MouseEvent) {
        if (this.isPanning) {
            this.panOffset = {
                x: this.panStart.offsetX + (e.clientX - this.panStart.x),
                y: this.panStart.offsetY + (e.clientY - this.panStart.y),
            };
            this.render();
            return;
        }
        const pos = this.getMousePos(e);
        if (this.isResizing && this.selectedShapeId && this.activeHandle) {
            const shape = this.existingShapes.find((s) => s.id === this.selectedShapeId);
            if (shape) { this.resizeShape(shape, pos.x, pos.y); this.render(); }
            return;
        }
        if (this.clicked && this.selectedTool === "selection" && this.selectedShapeId) {
            const shape = this.existingShapes.find((s) => s.id === this.selectedShapeId);
            if (shape) { this.moveShape(shape, pos.x - this.dragOffset.x, pos.y - this.dragOffset.y); this.render(); }
            return;
        }
        if (this.isErasing && this.selectedTool === "eraser") {
            this.eraseAtPoint(pos.x, pos.y);
            return;
        }

        if (!this.clicked) {
            if (this.selectedTool === "selection") {
                const hit = [...this.existingShapes].reverse().find((s) => this.hitTest(s, pos.x, pos.y));
                if (hit && hit.id && hit.id !== this.hoveredShapeId) {
                    this.hoveredShapeId = hit.id;
                    this.canvas.style.cursor = "move";
                } else if (!hit) {
                    this.hoveredShapeId = null;
                    this.canvas.style.cursor = "default";
                }
            }
            return;
        }
        const width = pos.x - this.startX, height = pos.y - this.startY;
        this.render();
        this.ctx.save();
        this.ctx.translate(this.panOffset.x, this.panOffset.y);
        this.ctx.scale(this.zoom, this.zoom);
        this.ctx.strokeStyle = this.strokeColor;
        this.ctx.fillStyle = "transparent";
        this.ctx.lineWidth = STROKE_WIDTH;
        this.ctx.lineCap = "round";
        this.ctx.lineJoin = "round";
        switch (this.selectedTool) {
            case "rectangle": this.ctx.strokeRect(this.startX, this.startY, width, height); break;
            case "diamond": this.drawDiamond(this.startX, this.startY, width, height, false); break;
            case "circle": {
                const cx = this.startX + width / 2, cy = this.startY + height / 2;
                const radius = Math.max(Math.abs(width), Math.abs(height)) / 2;
                this.ctx.beginPath();
                this.ctx.arc(cx, cy, radius, 0, Math.PI * 2);
                this.ctx.stroke();
                break;
            }
            case "arrow": this.drawArrow(this.startX, this.startY, width, height, false); break;
            case "line": this.drawLine(this.startX, this.startY, width, height, false); break;
            case "pencil":
                this.pencilPath.push({ x: pos.x, y: pos.y });
                if (this.pencilPath.length > 1) {
                    this.ctx.beginPath();
                    this.ctx.moveTo(this.pencilPath[0].x, this.pencilPath[0].y);
                    for (let i = 1; i < this.pencilPath.length; i++) this.ctx.lineTo(this.pencilPath[i].x, this.pencilPath[i].y);
                    this.ctx.stroke();
                }
                break;
        }
        this.ctx.restore();
    }

    private handleDblClick(e: MouseEvent) {
        const usePan = this.isSpaceDown || this.selectedTool === "hand";
        if (usePan) return;
        if (e.button === 2) return;
        const pos = this.getMousePos(e);
        const hit = [...this.existingShapes].reverse().find((s) => this.hitTest(s, pos.x, pos.y));
        if (hit && hit.type === "text" && hit.id) {
            this.existingShapes = this.existingShapes.filter((s) => s.id !== hit.id);
            this.render();
            const rect = this.canvas.getBoundingClientRect();
            const screenX = pos.x * this.zoom + this.panOffset.x + rect.left;
            const screenY = pos.y * this.zoom + this.panOffset.y + rect.top;
            this.onTextClick?.(hit.x, hit.y, screenX, screenY, hit);
        } else if (!hit) {
            e.preventDefault();
            const rect = this.canvas.getBoundingClientRect();
            const screenX = pos.x * this.zoom + this.panOffset.x + rect.left;
            const screenY = pos.y * this.zoom + this.panOffset.y + rect.top;
            this.onTextClick?.(pos.x, pos.y, screenX, screenY);
        }
    }

    private handleMouseUp(e: MouseEvent) {
        if (this.isPanning) {
            this.isPanning = false;
            this.updateCursor();
            return;
        }
        if (this.isResizing && this.selectedShapeId) {
            this.isResizing = false;
            this.activeHandle = null;
            const shape = this.existingShapes.find((s) => s.id === this.selectedShapeId);
            if (shape) { this.pushUndo(); this.socket.send(JSON.stringify({ type: "update", roomId: this.roomId, shape })); }
            this.updateCursor();
            return;
        }
        if (this.isErasing) {
            this.isErasing = false;
            this.erasedIds.clear();
            return;
        }
        if (this.selectedTool === "selection") {
            if (this.clicked && this.selectedShapeId) {
                const shape = this.existingShapes.find((s) => s.id === this.selectedShapeId);
                if (shape) { this.pushUndo(); this.socket.send(JSON.stringify({ type: "update", roomId: this.roomId, shape })); }
            }
            this.clicked = false;
            return;
        }
        if (!this.clicked) return;
        this.clicked = false;
        const pos = this.getMousePos(e);
        const width = pos.x - this.startX, height = pos.y - this.startY;
        const id = makeId();
        let shape: Shape | null = null;
        switch (this.selectedTool) {
            case "rectangle":
                if (Math.abs(width) > 3 || Math.abs(height) > 3)
                    shape = { type: "rect", id, x: this.startX, y: this.startY, width, height, strokeColor: this.strokeColor, fillColor: this.fillColor, strokeWidth: STROKE_WIDTH };
                break;
            case "diamond":
                if (Math.abs(width) > 3 || Math.abs(height) > 3)
                    shape = { type: "diamond", id, x: this.startX, y: this.startY, width, height, strokeColor: this.strokeColor, fillColor: this.fillColor, strokeWidth: STROKE_WIDTH };
                break;
            case "circle":
                if (Math.abs(width) > 3 || Math.abs(height) > 3)
                    shape = { type: "circle", id, centerX: this.startX + width / 2, centerY: this.startY + height / 2, radius: Math.max(Math.abs(width), Math.abs(height)) / 2, strokeColor: this.strokeColor, fillColor: this.fillColor, strokeWidth: STROKE_WIDTH };
                break;
            case "arrow":
                if (Math.abs(width) > 3 || Math.abs(height) > 3)
                    shape = { type: "arrow", id, x: this.startX, y: this.startY, width, height, strokeColor: this.strokeColor, fillColor: this.fillColor, strokeWidth: STROKE_WIDTH };
                break;
            case "line":
                if (Math.abs(width) > 3 || Math.abs(height) > 3)
                    shape = { type: "line", id, x: this.startX, y: this.startY, width, height, strokeColor: this.strokeColor, fillColor: this.fillColor, strokeWidth: STROKE_WIDTH };
                break;
            case "pencil":
                if (this.pencilPath.length > 1)
                    shape = { type: "pencil", id, points: [...this.pencilPath], strokeColor: this.strokeColor, fillColor: this.fillColor, strokeWidth: STROKE_WIDTH };
                this.pencilPath = [];
                break;
        }
        if (shape) {
            this.pushUndo();
            this.existingShapes.push(shape);
            this.socket.send(JSON.stringify({ type: "draw", roomId: this.roomId, shape }));
        }
        this.render();
    }

    private resizeShape(shape: Shape, mouseX: number, mouseY: number) {
        const rs = this.resizeStart;
        const dx = mouseX - rs.x, dy = mouseY - rs.y;
        if (shape.type === "rect") {
            const h = this.activeHandle;
            if (h === "br") { shape.width = rs.shapeW + dx; shape.height = rs.shapeH + dy; }
            else if (h === "bl") { shape.x = rs.shapeX + dx; shape.width = rs.shapeW - dx; shape.height = rs.shapeH + dy; }
            else if (h === "tr") { shape.y = rs.shapeY + dy; shape.width = rs.shapeW + dx; shape.height = rs.shapeH - dy; }
            else if (h === "tl") { shape.x = rs.shapeX + dx; shape.y = rs.shapeY + dy; shape.width = rs.shapeW - dx; shape.height = rs.shapeH - dy; }
            else if (h === "mr") { shape.width = rs.shapeW + dx; }
            else if (h === "ml") { shape.x = rs.shapeX + dx; shape.width = rs.shapeW - dx; }
            else if (h === "tm") { shape.y = rs.shapeY + dy; shape.height = rs.shapeH - dy; }
            else if (h === "bm") { shape.height = rs.shapeH + dy; }
        } else if (shape.type === "circle") {
            if (this.activeHandle === "ec" || this.activeHandle === "wc") shape.radius = Math.abs(mouseX - rs.centerX);
            else if (this.activeHandle === "nc" || this.activeHandle === "sc") shape.radius = Math.abs(mouseY - rs.centerY);
        } else if (shape.type === "diamond") {
            if (this.activeHandle === "tr") shape.width = rs.shapeW + dx;
            else if (this.activeHandle === "tl") { shape.x = rs.shapeX + dx; shape.width = rs.shapeW - dx; }
            else if (this.activeHandle === "br") shape.height = rs.shapeH + dy;
            else if (this.activeHandle === "bl") { shape.y = rs.shapeY + dy; shape.height = rs.shapeH - dy; }
        } else if (shape.type === "ellipse") {
            if (this.activeHandle === "ec" || this.activeHandle === "wc") {
                if (this.activeHandle === "wc") shape.x = rs.shapeX + dx;
                shape.width = this.activeHandle === "ec" ? rs.shapeW + dx * 2 : rs.shapeW - dx * 2;
            } else if (this.activeHandle === "nc" || this.activeHandle === "sc") {
                if (this.activeHandle === "nc") shape.y = rs.shapeY + dy;
                shape.height = this.activeHandle === "sc" ? rs.shapeH + dy * 2 : rs.shapeH - dy * 2;
            }
        } else if (shape.type === "text") {
            const dist = Math.hypot(dx, dy);
            const scale = 1 + (dist * (dx > 0 || dy > 0 ? 1 : -1)) / 50;
            shape.fontSize = Math.max(8, Math.round(rs.shapeFontSize * scale));
        }
    }

    private eraseAtPoint(px: number, py: number) {
        for (const shape of [...this.existingShapes]) {
            if (shape.id && !this.erasedIds.has(shape.id) && this.hitTest(shape, px, py)) {
                this.erasedIds.add(shape.id);
                this.existingShapes = this.existingShapes.filter((s) => s.id !== shape.id);
                this.socket.send(JSON.stringify({ type: "erase", roomId: this.roomId, shapeId: shape.id }));
                this.render();
            }
        }
    }

    private moveShape(shape: Shape, newX: number, newY: number) {
        if (shape.type === "rect") { shape.x = newX; shape.y = newY; }
        else if (shape.type === "diamond" || shape.type === "ellipse" || shape.type === "line" || shape.type === "arrow") { shape.x = newX; shape.y = newY; }
        else if (shape.type === "circle") { shape.centerX = newX; shape.centerY = newY; }
        else if (shape.type === "pencil") {
            const points = getSafePencilPoints(shape);
            if (points.length === 0) return;
            const dx = newX - points[0].x, dy = newY - points[0].y;
            shape.points = points.map((p) => ({ x: p.x + dx, y: p.y + dy }));
        } else if (shape.type === "text" || shape.type === "image") { shape.x = newX; shape.y = newY; }
    }

    private handleWheel(e: WheelEvent) {
        e.preventDefault();
        if (e.shiftKey) {
            this.panOffset.x -= e.deltaY;
            this.render();
            return;
        }
        const rect = this.canvas.getBoundingClientRect();
        const mouseX = e.clientX - rect.left, mouseY = e.clientY - rect.top;
        const zoomFactor = e.deltaY > 0 ? 0.9 : 1.1;
        const newZoom = Math.max(this.minZoom, Math.min(this.maxZoom, this.zoom * zoomFactor));
        if (newZoom !== this.zoom) {
            const zoomRatio = newZoom / this.zoom;
            this.panOffset.x = mouseX - (mouseX - this.panOffset.x) * zoomRatio;
            this.panOffset.y = mouseY - (mouseY - this.panOffset.y) * zoomRatio;
            this.zoom = newZoom;
            this.onZoomChange?.(this.zoom);
            this.render();
        }
    }

    private handleKeyDown(e: KeyboardEvent) {
        const target = e.target as HTMLElement | null;
        if (target && (target.tagName === "INPUT" || target.tagName === "TEXTAREA")) return;
        if (e.key === " " || e.code === "Space") { e.preventDefault(); this.isSpaceDown = true; this.updateCursor(); }
        if ((e.ctrlKey || e.metaKey) && (e.key === "=" || e.key === "+")) { e.preventDefault(); this.setZoom(this.zoom * 1.2); }
        if ((e.ctrlKey || e.metaKey) && (e.key === "-" || e.key === "_")) { e.preventDefault(); this.setZoom(this.zoom / 1.2); }
        if ((e.ctrlKey || e.metaKey) && e.key === "0") { e.preventDefault(); this.setZoom(1); }
        if ((e.ctrlKey || e.metaKey) && e.key === "z") { e.preventDefault(); this.undo(); return; }
        if ((e.ctrlKey || e.metaKey) && (e.key === "y" || (e.shiftKey && e.key === "Z"))) { e.preventDefault(); this.redo(); return; }
        if ((e.key === "Delete" || e.key === "Backspace") && this.selectedShapeId) {
            e.preventDefault();
            this.pushUndo();
            const id = this.selectedShapeId;
            this.existingShapes = this.existingShapes.filter((s) => s.id !== id);
            this.selectedShapeId = null;
            this.socket.send(JSON.stringify({ type: "erase", roomId: this.roomId, shapeId: id }));
            this.render();
        }
        if (e.key === "Escape") { this.selectedShapeId = null; this.render(); }
    }

    private handleKeyUp(e: KeyboardEvent) {
        if (e.key === " " || e.code === "Space") { this.isSpaceDown = false; this.updateCursor(); }
    }
}

const imageCache = new Map<string, HTMLImageElement>();
export function preloadImage(src: string): HTMLImageElement {
    let img = imageCache.get(src);
    if (!img) { img = new window.Image(); img.src = src; imageCache.set(src, img); }
    return img;
}
