import { ImageResponse } from "next/og";

export const alt = "Drawboard — Collaborative whiteboard for teams";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 72,
          background: "linear-gradient(135deg, #fbfaf7 0%, #efeaf8 100%)",
          color: "#1a1725",
          fontFamily: '"Comic Sans MS", "Comic Sans", cursive',
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16, fontSize: 34, fontWeight: 600 }}>
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: 16,
              background: "#6c50d9",
              transform: "rotate(-6deg)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              position: "relative",
            }}
          >
            <div
              style={{
                width: 24,
                height: 18,
                border: "2.5px solid #fff",
                borderRadius: 5,
                position: "absolute",
                left: 12,
                top: 16,
              }}
            />
            <div
              style={{
                color: "#fff",
                fontSize: 34,
                fontFamily: '"Comic Sans MS", "Comic Sans", cursive',
                fontWeight: 700,
                lineHeight: 1,
                position: "absolute",
                left: 22,
                top: 8,
              }}
            >
              d
            </div>
          </div>
          drawboard<span style={{ color: "#6c50d9" }}>.</span>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <div style={{ display: "flex", flexWrap: "wrap", columnGap: 22, fontSize: 88, fontWeight: 600, letterSpacing: -2, lineHeight: 1 }}>
            <span>Good ideas start with a</span>
            <span style={{ color: "#6c50d9", fontWeight: 700 }}>little scribble.</span>
          </div>
          <div style={{ fontSize: 30, color: "#5d5868" }}>Sketch, diagram, and think together — in real time.</div>
        </div>
      </div>
    ),
    size,
  );
}
