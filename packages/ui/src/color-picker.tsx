"use client"

import * as React from "react"
import { cn } from "./lib/utils"
import { Popover, PopoverContent, PopoverTrigger } from "./popover"
import { Pipette } from "lucide-react"

interface ColorPickerProps {
  value: string
  onChange: (value: string) => void
  className?: string
}

const PRESET_COLORS = [
  "#ffffff", "#f8f9fa", "#e9ecef", "#dee2e6",
  "#ff6363", "#ff922b", "#fcc419", "#51cf66",
  "#22b8cf", "#339af0", "#748ffc", "#cc5de8",
  "#000000", "#212529", "#495057", "#868e96",
]

export function ColorPicker({ value, onChange, className }: ColorPickerProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <button
          className={cn(
            "h-8 w-8 rounded-buttons border border-graphite-500 transition-all duration-200 hover:border-graphite-400 focus:outline-none focus:ring-1 focus:ring-ring",
            className
          )}
          style={{ backgroundColor: value || "#ffffff" }}
        >
          <span className="sr-only">Pick a color</span>
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-56 p-3" align="start">
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Pipette className="h-3.5 w-3.5 text-slate-200" />
            <span className="text-xs font-medium text-slate-200">Color</span>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={value}
              onChange={(e) => onChange(e.target.value)}
              placeholder="#000000"
              className="input-raycast flex-1 text-xs h-7 px-2"
            />
            <div
              className="h-7 w-7 rounded-buttons border border-graphite-500 shrink-0"
              style={{ backgroundColor: value }}
            />
          </div>
          <div className="grid grid-cols-8 gap-1.5">
            {PRESET_COLORS.map((color) => (
              <button
                key={color}
                onClick={() => onChange(color)}
                className={cn(
                  "h-6 w-6 rounded-buttons border border-graphite-500 transition-all duration-150 hover:scale-110 hover:border-slate-200",
                  value === color && "ring-1 ring-ash-50 ring-offset-1 ring-offset-graphite-700"
                )}
                style={{ backgroundColor: color }}
              >
                <span className="sr-only">{color}</span>
              </button>
            ))}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}
