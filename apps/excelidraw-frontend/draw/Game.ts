import { Tool } from "@/components/Canvas";
import { getExistingShapes } from "./http";
import type { Shape } from "@repo/common/types";

const STROKE_COLOR = "#1e1e1e";
const STROKE_WIDTH = 2;
const FONT_SIZE = 20;
const CANVAS_BG = "#ffffff";

function makeId() {
    return `shape_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
}

export class Game {
    private canvas: HTMLCanvasElement;
    private ctx: CanvasRenderingContext2D;
    private existingShapes: Shape[];
    private roomId: string;
    private clicked = false;
    private startX = 0;
    private startY = 0;
    private selectedTool: Tool = "pencil";
    private socket: WebSocket;
    private pencilPath: { x: number; y: number }[] = [];
    private panOffset = { x: 0, y: 0 };
    private isPanning = false;
    private panStart = { x: 0, y: 0, offsetX: 0, offsetY: 0 };
    private selectedShapeId: string | null = null;
    private dragOffset = { x: 0, y: 0 };
    private isSpaceDown = false;
    private onTextClick: ((x: number, y: number) => void) | null = null;
    private onImageClick: (() => void) | null = null;

    private boundMouseDown: (e: MouseEvent) => void;
    private boundMouseUp: (e: MouseEvent) => void;
    private boundMouseMove: (e: MouseEvent) => void;
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
        this.selectedTool = "pencil";

        this.boundMouseDown = this.handleMouseDown.bind(this);
        this.boundMouseUp = this.handleMouseUp.bind(this);
        this.boundMouseMove = this.handleMouseMove.bind(this);
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
        this.canvas.removeEventListener("wheel", this.boundWheel);
        this.canvas.removeEventListener("contextmenu", this.boundContextMenu);
        window.removeEventListener("keydown", this.boundKeyDown);
        window.removeEventListener("keyup", this.boundKeyUp);
        this.socket.removeEventListener("message", this.boundMessage);
    }

    setTool(tool: Tool) {
        this.selectedTool = tool;
        this.updateCursor();
    }

    setTextClickHandler(handler: ((x: number, y: number) => void) | null) {
        this.onTextClick = handler;
    }

    setImageClickHandler(handler: (() => void) | null) {
        this.onImageClick = handler;
    }

    addShape(shape: Shape) {
        this.existingShapes.push(shape);
        this.render();
    }

    clearShapes() {
        this.existingShapes = [];
        this.render();
    }

    getShapes(): Shape[] {
        return this.existingShapes;
    }

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
        this.canvas.addEventListener("wheel", this.boundWheel, { passive: false });
        this.canvas.addEventListener("contextmenu", this.boundContextMenu);
        window.addEventListener("keydown", this.boundKeyDown);
        window.addEventListener("keyup", this.boundKeyUp);
        this.updateCursor();
    }

    private updateCursor() {
        const map: Record<string, string> = {
            hand: this.isPanning ? "grabbing" : "grab",
            rectangle: "crosshair",
            diamond: "crosshair",
            ellipse: "crosshair",
            arrow: "crosshair",
            line: "crosshair",
            pencil: "crosshair",
            text: "text",
            image: "copy",
            eraser: "cell",
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
                this.render();
            } else if (msg.type === "clear") {
                this.existingShapes = [];
                this.render();
            }
        } catch {
            // ignore malformed messages
        }
    }

    private render() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.fillStyle = CANVAS_BG;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        this.ctx.save();
        this.ctx.translate(this.panOffset.x, this.panOffset.y);

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

        const isSelected: boolean = Boolean(
            !isPreview && this.selectedShapeId && shape.id === this.selectedShapeId
        );

        switch (shape.type) {
            case "rect": {
                this.drawRectShape(shape.x, shape.y, shape.width, shape.height, isSelected);
                break;
            }
            case "circle": {
                this.ctx.beginPath();
                this.ctx.arc(shape.centerX, shape.centerY, Math.abs(shape.radius), 0, Math.PI * 2);
                this.ctx.stroke();
                if (isSelected) this.drawSelectionRing(shape.centerX, shape.centerY, Math.abs(shape.radius));
                break;
            }
            case "diamond": {
                this.drawDiamond(shape.x, shape.y, shape.width, shape.height, isSelected);
                break;
            }
            case "ellipse": {
                this.drawEllipse(shape.x, shape.y, shape.width, shape.height, isSelected);
                break;
            }
            case "arrow": {
                this.drawArrow(shape.x, shape.y, shape.width, shape.height, isSelected);
                break;
            }
            case "line": {
                this.drawLine(shape.x, shape.y, shape.width, shape.height, isSelected);
                break;
            }
            case "pencil": {
                this.drawPencil(shape.startX, shape.startY, shape.endX, shape.endY, isSelected);
                break;
            }
            case "text": {
                this.drawText(shape.x, shape.y, shape.text, shape.fontSize, isSelected);
                break;
            }
            case "image": {
                this.drawImage(shape.x, shape.y, shape.width, shape.height, shape.src, isSelected);
                break;
            }
        }
    }

    private drawRectShape(x: number, y: number, w: number, h: number, isSelected: boolean) {
        this.ctx.strokeRect(x, y, w, h);
        if (isSelected) this.drawSelectionRing(x + w / 2, y + h / 2, Math.max(Math.abs(w), Math.abs(h)) / 2);
    }

    private drawDiamond(x: number, y: number, w: number, h: number, isSelected: boolean) {
        const cx = x + w / 2;
        const cy = y + h / 2;
        this.ctx.beginPath();
        this.ctx.moveTo(cx, y);
        this.ctx.lineTo(x + w, cy);
        this.ctx.lineTo(cx, y + h);
        this.ctx.lineTo(x, cy);
        this.ctx.closePath();
        this.ctx.stroke();
        if (isSelected) this.drawSelectionRing(cx, cy, Math.max(Math.abs(w), Math.abs(h)) / 2);
    }

    private drawEllipse(x: number, y: number, w: number, h: number, isSelected: boolean) {
        const cx = x + w / 2;
        const cy = y + h / 2;
        const rx = Math.abs(w / 2);
        const ry = Math.abs(h / 2);
        this.ctx.beginPath();
        this.ctx.ellipse(cx, cy, rx, ry, 0, 0, Math.PI * 2);
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
        const x2 = x + w;
        const y2 = y + h;
        const angle = Math.atan2(h, w);
        const headLen = 14;
        this.ctx.beginPath();
        this.ctx.moveTo(x, y);
        this.ctx.lineTo(x2, y2);
        this.ctx.stroke();
        this.ctx.save();
        this.ctx.fillStyle = shapeDefaultColor();
        this.ctx.beginPath();
        this.ctx.moveTo(x2, y2);
        this.ctx.lineTo(x2 - headLen * Math.cos(angle - Math.PI / 6), y2 - headLen * Math.sin(angle - Math.PI / 6));
        this.ctx.lineTo(x2 - headLen * Math.cos(angle + Math.PI / 6), y2 - headLen * Math.sin(angle + Math.PI / 6));
        this.ctx.closePath();
        this.ctx.fill();
        this.ctx.restore();
        if (isSelected) this.drawSelectionRing((x + x2) / 2, (y + y2) / 2, Math.hypot(w, h) / 2);
    }

    private drawPencil(sx: number, sy: number, ex: number, ey: number, isSelected: boolean) {
        this.ctx.beginPath();
        this.ctx.moveTo(sx, sy);
        this.ctx.lineTo(ex, ey);
        this.ctx.stroke();
        if (isSelected) this.drawSelectionRing((sx + ex) / 2, (sy + ey) / 2, Math.hypot(ex - sx, ey - sy) / 2);
    }

    private drawText(x: number, y: number, text: string, fontSize: number, isSelected: boolean) {
        this.ctx.font = `${fontSize}px "Virgil", "Segoe UI Emoji", sans-serif`;
        this.ctx.fillStyle = STROKE_COLOR;
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
        if (img && img.complete) {
            this.ctx.drawImage(img, x, y, w, h);
        }
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

    private getMousePos(e: MouseEvent) {
        const rect = this.canvas.getBoundingClientRect();
        return {
            x: e.clientX - rect.left - this.panOffset.x,
            y: e.clientY - rect.top - this.panOffset.y,
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
                const cx = shape.x + shape.width / 2;
                const cy = shape.y + shape.height / 2;
                const dx = Math.abs(px - cx) / (Math.abs(shape.width / 2) || 1);
                const dy = Math.abs(py - cy) / (Math.abs(shape.height / 2) || 1);
                return dx + dy <= 1;
            }
            case "ellipse": {
                const cx = shape.x + shape.width / 2;
                const cy = shape.y + shape.height / 2;
                const rx = Math.abs(shape.width / 2) || 1;
                const ry = Math.abs(shape.height / 2) || 1;
                const ndx = (px - cx) / rx;
                const ndy = (py - cy) / ry;
                return ndx * ndx + ndy * ndy <= 1;
            }
            case "line":
            case "arrow":
                return pointNearLine(px, py, shape.x, shape.y, shape.x + shape.width, shape.y + shape.height, pad);
            case "pencil":
                return pointNearLine(px, py, shape.startX, shape.startY, shape.endX, shape.endY, pad);
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
        if (shape.type === "circle") {
            return { x: shape.centerX, y: shape.centerY };
        }
        if (shape.type === "pencil") {
            return { x: shape.startX, y: shape.startY };
        }
        if (shape.type === "text" || shape.type === "image" || shape.type === "rect" || shape.type === "diamond" || shape.type === "ellipse" || shape.type === "line" || shape.type === "arrow") {
            return { x: shape.x, y: shape.y };
        }
        return { x: 0, y: 0 };
    }

    private handleMouseDown(e: MouseEvent) {
        if (e.button === 2) return;
        const pos = this.getMousePos(e);
        const usePan = this.isSpaceDown || this.selectedTool === "hand";

        if (usePan) {
            this.isPanning = true;
            this.panStart = {
                x: e.clientX,
                y: e.clientY,
                offsetX: this.panOffset.x,
                offsetY: this.panOffset.y,
            };
            this.updateCursor();
            return;
        }

        if (this.selectedTool === "lock" || this.selectedTool === "more") return;

        if (this.selectedTool === "selection") {
            const hit = [...this.existingShapes].reverse().find((s) => this.hitTest(s, pos.x, pos.y));
            if (hit && hit.id) {
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
            const hit = this.existingShapes.find((s) => this.hitTest(s, pos.x, pos.y));
            if (hit && hit.id) {
                this.existingShapes = this.existingShapes.filter((s) => s.id !== hit.id);
                this.socket.send(JSON.stringify({ type: "erase", roomId: this.roomId, shapeId: hit.id }));
                this.render();
            }
            return;
        }

        if (this.selectedTool === "text") {
            if (this.onTextClick) {
                this.onTextClick(pos.x, pos.y);
            }
            return;
        }

        if (this.selectedTool === "image") {
            if (this.onImageClick) {
                this.onImageClick();
            }
            return;
        }

        this.clicked = true;
        this.startX = pos.x;
        this.startY = pos.y;
        if (this.selectedTool === "pencil") {
            this.pencilPath = [{ x: pos.x, y: pos.y }];
        }
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

        if (this.clicked && this.selectedTool === "selection" && this.selectedShapeId) {
            const shape = this.existingShapes.find((s) => s.id === this.selectedShapeId);
            if (shape) {
                this.moveShape(shape, pos.x - this.dragOffset.x, pos.y - this.dragOffset.y);
                this.render();
            }
            return;
        }

        if (!this.clicked) return;

        const width = pos.x - this.startX;
        const height = pos.y - this.startY;

        this.render();
        this.ctx.save();
        this.ctx.translate(this.panOffset.x, this.panOffset.y);
        this.ctx.strokeStyle = STROKE_COLOR;
        this.ctx.fillStyle = "transparent";
        this.ctx.lineWidth = STROKE_WIDTH;
        this.ctx.lineCap = "round";
        this.ctx.lineJoin = "round";

        switch (this.selectedTool) {
            case "rectangle":
                this.ctx.strokeRect(this.startX, this.startY, width, height);
                break;
            case "diamond":
                this.drawDiamond(this.startX, this.startY, width, height, false);
                break;
            case "ellipse":
                this.drawEllipse(this.startX, this.startY, width, height, false);
                break;
            case "arrow":
                this.drawArrow(this.startX, this.startY, width, height, false);
                break;
            case "line":
                this.drawLine(this.startX, this.startY, width, height, false);
                break;
            case "pencil":
                this.pencilPath.push({ x: pos.x, y: pos.y });
                if (this.pencilPath.length > 1) {
                    this.ctx.beginPath();
                    this.ctx.moveTo(this.pencilPath[0].x, this.pencilPath[0].y);
                    for (let i = 1; i < this.pencilPath.length; i++) {
                        this.ctx.lineTo(this.pencilPath[i].x, this.pencilPath[i].y);
                    }
                    this.ctx.stroke();
                }
                break;
        }
        this.ctx.restore();
    }

    private handleMouseUp(e: MouseEvent) {
        if (this.isPanning) {
            this.isPanning = false;
            this.updateCursor();
            return;
        }

        if (this.selectedTool === "selection") {
            this.clicked = false;
            return;
        }

        if (!this.clicked) return;
        this.clicked = false;

        const pos = this.getMousePos(e);
        const width = pos.x - this.startX;
        const height = pos.y - this.startY;
        const id = makeId();
        let shape: Shape | null = null;

        switch (this.selectedTool) {
            case "rectangle":
                if (Math.abs(width) > 3 || Math.abs(height) > 3) {
                    shape = {
                        type: "rect",
                        id,
                        x: this.startX,
                        y: this.startY,
                        width,
                        height,
                        strokeColor: STROKE_COLOR,
                        strokeWidth: STROKE_WIDTH,
                    };
                }
                break;
            case "diamond":
                if (Math.abs(width) > 3 || Math.abs(height) > 3) {
                    shape = {
                        type: "diamond",
                        id,
                        x: this.startX,
                        y: this.startY,
                        width,
                        height,
                        strokeColor: STROKE_COLOR,
                        strokeWidth: STROKE_WIDTH,
                    };
                }
                break;
            case "ellipse":
                if (Math.abs(width) > 3 || Math.abs(height) > 3) {
                    shape = {
                        type: "ellipse",
                        id,
                        x: this.startX,
                        y: this.startY,
                        width,
                        height,
                        strokeColor: STROKE_COLOR,
                        strokeWidth: STROKE_WIDTH,
                    };
                }
                break;
            case "arrow":
                if (Math.abs(width) > 3 || Math.abs(height) > 3) {
                    shape = {
                        type: "arrow",
                        id,
                        x: this.startX,
                        y: this.startY,
                        width,
                        height,
                        strokeColor: STROKE_COLOR,
                        strokeWidth: STROKE_WIDTH,
                    };
                }
                break;
            case "line":
                if (Math.abs(width) > 3 || Math.abs(height) > 3) {
                    shape = {
                        type: "line",
                        id,
                        x: this.startX,
                        y: this.startY,
                        width,
                        height,
                        strokeColor: STROKE_COLOR,
                        strokeWidth: STROKE_WIDTH,
                    };
                }
                break;
            case "pencil":
                if (this.pencilPath.length > 1) {
                    const first = this.pencilPath[0];
                    const last = this.pencilPath[this.pencilPath.length - 1];
                    shape = {
                        type: "pencil",
                        id,
                        startX: first.x,
                        startY: first.y,
                        endX: last.x,
                        endY: last.y,
                        strokeColor: STROKE_COLOR,
                        strokeWidth: STROKE_WIDTH,
                    };
                }
                this.pencilPath = [];
                break;
        }

        if (shape) {
            this.existingShapes.push(shape);
            this.socket.send(JSON.stringify({ type: "draw", roomId: this.roomId, shape }));
        }
        this.render();
    }

    private moveShape(shape: Shape, newX: number, newY: number) {
        if (shape.type === "rect") {
            shape.x = newX;
            shape.y = newY;
        } else if (shape.type === "diamond" || shape.type === "ellipse" || shape.type === "line" || shape.type === "arrow") {
            shape.x = newX;
            shape.y = newY;
        } else if (shape.type === "circle") {
            shape.centerX = newX;
            shape.centerY = newY;
        } else if (shape.type === "pencil") {
            const dx = newX - shape.startX;
            const dy = newY - shape.startY;
            shape.startX += dx;
            shape.startY += dy;
            shape.endX += dx;
            shape.endY += dy;
        } else if (shape.type === "text" || shape.type === "image") {
            shape.x = newX;
            shape.y = newY;
        }
    }

    private handleWheel(e: WheelEvent) {
        if (!e.ctrlKey) return;
        e.preventDefault();
    }

    private handleKeyDown(e: KeyboardEvent) {
        const target = e.target as HTMLElement | null;
        if (target && (target.tagName === "INPUT" || target.tagName === "TEXTAREA")) return;
        if (e.key === " " || e.code === "Space") {
            e.preventDefault();
            this.isSpaceDown = true;
            this.updateCursor();
        }
        if ((e.key === "Delete" || e.key === "Backspace") && this.selectedShapeId) {
            e.preventDefault();
            const id = this.selectedShapeId;
            this.existingShapes = this.existingShapes.filter((s) => s.id !== id);
            this.selectedShapeId = null;
            this.socket.send(JSON.stringify({ type: "erase", roomId: this.roomId, shapeId: id }));
            this.render();
        }
        if (e.key === "Escape") {
            this.selectedShapeId = null;
            this.render();
        }
    }

    private handleKeyUp(e: KeyboardEvent) {
        if (e.key === " " || e.code === "Space") {
            this.isSpaceDown = false;
            this.updateCursor();
        }
    }
}

function shapeDefaultColor() {
    return STROKE_COLOR;
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

const imageCache = new Map<string, HTMLImageElement>();
export function preloadImage(src: string): HTMLImageElement {
    let img = imageCache.get(src);
    if (!img) {
        img = new window.Image();
        img.src = src;
        imageCache.set(src, img);
    }
    return img;
}
