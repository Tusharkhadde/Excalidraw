"use client"

import React, { useState } from "react"
import { cn } from "@/lib/utils"
import * as SliderPrimitive from "@radix-ui/react-slider"
import { 
  AlignLeft, AlignCenter, AlignRight,
  ArrowDownToLine, ArrowDown, ArrowUp, ArrowUpToLine,
  PenTool, Type, Code, Heading
} from "lucide-react"

interface ColorPickerWrapperProps {
  strokeColor: string
  fillColor: string
  onStrokeColorChange: (value: string) => void
  onFillColorChange: (value: string) => void
  className?: string
  isDark?: boolean
}

const COLORS = [
  "#e9ecef",
  "#ff8787",
  "#51cf66",
  "#339af0",
  "#fcc419",
  "transparent",
  "#e9ecef",
]

const FONT_FAMILIES = [
  { id: "hand-drawn", icon: PenTool },
  { id: "normal", icon: Type },
  { id: "code", icon: Code },
  { id: "serif", icon: Heading },
]

const FONT_SIZES = ["S", "M", "L", "XL"]

const TEXT_ALIGNS = [
  { id: "left", icon: AlignLeft },
  { id: "center", icon: AlignCenter },
  { id: "right", icon: AlignRight },
]

const VERTICAL_ALIGNS = [
  { id: "top", icon: ArrowUpToLine },
  { id: "middle", icon: AlignCenter },
  { id: "bottom", icon: ArrowDownToLine },
]

export function ColorPickerWrapper({
  strokeColor,
  onStrokeColorChange,
  className,
}: ColorPickerWrapperProps) {
  const [activeFontFamily, setActiveFontFamily] = useState("normal")
  const [activeFontSize, setActiveFontSize] = useState("S")
  const [activeTextAlign, setActiveTextAlign] = useState("center")
  const [activeVerticalAlign, setActiveVerticalAlign] = useState("middle")
  const [opacity, setOpacity] = useState(100)

  return (
    <div className={cn("flex flex-col gap-4 pointer-events-auto", className)}>
      {/* Menu Button Placeholder */}
      <button className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#232329] text-gray-400 hover:bg-[#2b2b36] hover:text-white transition-colors">
        <div className="flex flex-col gap-1.5">
          <span className="block h-0.5 w-4 bg-current rounded-full"></span>
          <span className="block h-0.5 w-4 bg-current rounded-full"></span>
          <span className="block h-0.5 w-4 bg-current rounded-full"></span>
        </div>
      </button>

      {/* Main Panel */}
      <div className="w-64 rounded-2xl bg-[#232329] p-4 text-[#d1d5db] shadow-xl">
        <div className="space-y-6">
          
          {/* Stroke Section */}
          <div className="space-y-2">
            <h3 className="text-xs font-semibold">Stroke</h3>
            <div className="flex gap-2">
              {COLORS.map((color, idx) => (
                <button
                  key={idx}
                  onClick={() => onStrokeColorChange(color === "transparent" ? "transparent" : color)}
                  className={cn(
                    "h-6 w-6 rounded border transition-transform hover:scale-110",
                    strokeColor === color || (color === "transparent" && strokeColor === "transparent")
                      ? "ring-2 ring-white ring-offset-2 ring-offset-[#232329]" 
                      : "border-white/10"
                  )}
                  style={{ backgroundColor: color === "transparent" ? "transparent" : color }}
                />
              ))}
            </div>
          </div>

          {/* Font Family Section */}
          <div className="space-y-2">
            <h3 className="text-xs font-semibold">Font family</h3>
            <div className="flex gap-2">
              {FONT_FAMILIES.map((font) => (
                <button
                  key={font.id}
                  onClick={() => setActiveFontFamily(font.id)}
                  className={cn(
                    "flex h-8 w-10 items-center justify-center rounded-lg transition-colors",
                    activeFontFamily === font.id
                      ? "bg-[#4338ca] text-white"
                      : "bg-[#2d2d35] text-gray-400 hover:bg-[#3b3b45] hover:text-white"
                  )}
                >
                  <font.icon className="h-4 w-4" />
                </button>
              ))}
            </div>
          </div>

          {/* Font Size Section */}
          <div className="space-y-2">
            <h3 className="text-xs font-semibold">Font size</h3>
            <div className="flex gap-2">
              {FONT_SIZES.map((size) => (
                <button
                  key={size}
                  onClick={() => setActiveFontSize(size)}
                  className={cn(
                    "flex h-8 w-10 items-center justify-center rounded-lg text-xs font-medium transition-colors",
                    activeFontSize === size
                      ? "bg-[#4338ca] text-white"
                      : "bg-[#2d2d35] text-gray-400 hover:bg-[#3b3b45] hover:text-white"
                  )}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* Text Align Section */}
          <div className="space-y-3">
            <h3 className="text-xs font-semibold">Text align</h3>
            <div className="flex gap-2">
              {TEXT_ALIGNS.map((align) => (
                <button
                  key={align.id}
                  onClick={() => setActiveTextAlign(align.id)}
                  className={cn(
                    "flex h-8 w-10 items-center justify-center rounded-lg transition-colors",
                    activeTextAlign === align.id
                      ? "bg-[#4338ca] text-white"
                      : "bg-[#2d2d35] text-gray-400 hover:bg-[#3b3b45] hover:text-white"
                  )}
                >
                  <align.icon className="h-4 w-4" />
                </button>
              ))}
            </div>
            <div className="flex gap-2">
              {VERTICAL_ALIGNS.map((align) => (
                <button
                  key={align.id}
                  onClick={() => setActiveVerticalAlign(align.id)}
                  className={cn(
                    "flex h-8 w-10 items-center justify-center rounded-lg transition-colors",
                    activeVerticalAlign === align.id
                      ? "bg-[#4338ca] text-white"
                      : "bg-[#2d2d35] text-gray-400 hover:bg-[#3b3b45] hover:text-white"
                  )}
                >
                  <align.icon className="h-4 w-4" />
                </button>
              ))}
            </div>
          </div>

          {/* Opacity Section */}
          <div className="space-y-3">
            <h3 className="text-xs font-semibold">Opacity</h3>
            <SliderPrimitive.Root
              className="relative flex w-full touch-none select-none items-center"
              value={[opacity]}
              onValueChange={(val) => setOpacity(val[0])}
              max={100}
              step={1}
            >
              <SliderPrimitive.Track className="relative h-2 w-full grow overflow-hidden rounded-full bg-[#3b3b45]">
                <SliderPrimitive.Range className="absolute h-full bg-[#3b82f6]" />
              </SliderPrimitive.Track>
              <SliderPrimitive.Thumb className="block h-4 w-4 rounded-full border-2 border-[#3b82f6] bg-[#3b82f6] shadow transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 disabled:pointer-events-none disabled:opacity-50" />
            </SliderPrimitive.Root>
          </div>

          {/* Layers Section */}
          <div className="space-y-2">
            <h3 className="text-xs font-semibold">Layers</h3>
            <div className="flex gap-2">
              <button className="flex h-8 w-10 items-center justify-center rounded-lg bg-[#2d2d35] text-gray-400 hover:bg-[#3b3b45] hover:text-white transition-colors">
                <ArrowDownToLine className="h-4 w-4" />
              </button>
              <button className="flex h-8 w-10 items-center justify-center rounded-lg bg-[#2d2d35] text-gray-400 hover:bg-[#3b3b45] hover:text-white transition-colors">
                <ArrowDown className="h-4 w-4" />
              </button>
              <button className="flex h-8 w-10 items-center justify-center rounded-lg bg-[#2d2d35] text-gray-400 hover:bg-[#3b3b45] hover:text-white transition-colors">
                <ArrowUp className="h-4 w-4" />
              </button>
              <button className="flex h-8 w-10 items-center justify-center rounded-lg bg-[#2d2d35] text-gray-400 hover:bg-[#3b3b45] hover:text-white transition-colors">
                <ArrowUpToLine className="h-4 w-4" />
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}
