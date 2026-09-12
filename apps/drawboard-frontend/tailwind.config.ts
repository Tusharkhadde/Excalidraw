import type { Config } from "tailwindcss";
import animate from "tailwindcss-animate";

export default {
  darkMode: ["class"],
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
    "../../packages/ui/src/**/*.{ts,tsx}",
  ],
  theme: {
    container: { center: true, padding: "1.5rem", screens: { "2xl": "1200px" } },
    extend: {
      fontFamily: {
        sans: ['"Comic Sans MS"', '"Comic Sans"', "Chalkboard SE", "Comic Neue", "cursive"],
        serif: ['"Comic Sans MS"', '"Comic Sans"', "Chalkboard SE", "Comic Neue", "cursive"],
        mono: ["var(--font-mono)", "ui-monospace", "SFMono-Regular", "monospace"],
      },
      colors: {
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        card: { DEFAULT: "hsl(var(--card))", foreground: "hsl(var(--card-foreground))" },
        popover: { DEFAULT: "hsl(var(--popover))", foreground: "hsl(var(--popover-foreground))" },
        primary: { DEFAULT: "hsl(var(--primary))", foreground: "hsl(var(--primary-foreground))" },
        secondary: { DEFAULT: "hsl(var(--secondary))", foreground: "hsl(var(--secondary-foreground))" },
        muted: { DEFAULT: "hsl(var(--muted))", foreground: "hsl(var(--muted-foreground))" },
        accent: { DEFAULT: "hsl(var(--accent))", foreground: "hsl(var(--accent-foreground))" },
        destructive: { DEFAULT: "hsl(var(--destructive))", foreground: "hsl(var(--destructive-foreground))" },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        ink: { DEFAULT: "hsl(var(--ink))", foreground: "hsl(var(--ink-foreground))" },
        /* Soft tonal surfaces for feature cards */
        lavender: "hsl(var(--tone-lavender))",
        peach: "hsl(var(--tone-peach))",
        mint: "hsl(var(--tone-mint))",
        butter: "hsl(var(--tone-butter))",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      boxShadow: {
        soft: "0 1px 2px rgba(20,16,32,0.04), 0 8px 24px -12px rgba(20,16,32,0.12)",
        lift: "0 2px 4px rgba(20,16,32,0.04), 0 24px 48px -24px rgba(20,16,32,0.22)",
        glow: "0 0 0 1px hsl(var(--primary) / 0.15), 0 12px 40px -12px hsl(var(--primary) / 0.45)",
      },
      keyframes: {
        "accordion-down": { from: { height: "0" }, to: { height: "var(--radix-accordion-content-height)" } },
        "accordion-up": { from: { height: "var(--radix-accordion-content-height)" }, to: { height: "0" } },
        /* transitions.dev-style motion */
        "rise-in": {
          "0%": { opacity: "0", transform: "translateY(18px)", filter: "blur(6px)" },
          "100%": { opacity: "1", transform: "translateY(0)", filter: "blur(0)" },
        },
        "fade-in": { "0%": { opacity: "0" }, "100%": { opacity: "1" } },
        "scale-in": {
          "0%": { opacity: "0", transform: "scale(0.96)", filter: "blur(4px)" },
          "100%": { opacity: "1", transform: "scale(1)", filter: "blur(0)" },
        },
        shake: {
          "10%, 90%": { transform: "translateX(-1px)" },
          "20%, 80%": { transform: "translateX(2px)" },
          "30%, 50%, 70%": { transform: "translateX(-4px)" },
          "40%, 60%": { transform: "translateX(4px)" },
        },
        "check-pop": {
          "0%": { transform: "scale(0.4) rotate(-20deg)", opacity: "0", filter: "blur(4px)" },
          "60%": { transform: "scale(1.15) rotate(4deg)", opacity: "1", filter: "blur(0)" },
          "100%": { transform: "scale(1) rotate(0)" },
        },
        shimmer: { "0%": { backgroundPosition: "-200% 0" }, "100%": { backgroundPosition: "200% 0" } },
        float: { "0%, 100%": { transform: "translateY(0) rotate(var(--tw-rotate, 0))" }, "50%": { transform: "translateY(-6px) rotate(var(--tw-rotate, 0))" } },
        "cursor-drift": {
          "0%, 100%": { transform: "translate(0, 0)" },
          "30%": { transform: "translate(-18px, 10px)" },
          "65%": { transform: "translate(12px, -8px)" },
        },
        "draw-path": { to: { strokeDashoffset: "0" } },
        marquee: { "0%": { transform: "translateX(0)" }, "100%": { transform: "translateX(-50%)" } },
      },
      animation: {
        "accordion-down": "accordion-down 0.25s ease-out",
        "accordion-up": "accordion-up 0.25s ease-out",
        "rise-in": "rise-in 0.7s cubic-bezier(0.22, 1, 0.36, 1) both",
        "fade-in": "fade-in 0.6s ease-out both",
        "scale-in": "scale-in 0.5s cubic-bezier(0.22, 1, 0.36, 1) both",
        shake: "shake 0.5s cubic-bezier(0.36, 0.07, 0.19, 0.97) both",
        "check-pop": "check-pop 0.45s cubic-bezier(0.34, 1.56, 0.64, 1) both",
        shimmer: "shimmer 2.2s linear infinite",
        float: "float 6s ease-in-out infinite",
        "cursor-drift": "cursor-drift 9s ease-in-out infinite",
        "draw-path": "draw-path 1.6s ease-out 0.4s forwards",
        marquee: "marquee 40s linear infinite",
      },
    },
  },
  plugins: [animate],
} satisfies Config;
