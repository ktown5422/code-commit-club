import { ImageResponse } from "next/og"

export const alt = "CodeStreak — build the habit one commit at a time"
export const size = { width: 1200, height: 630 }
export const contentType = "image/png"

// Rendered at build time by next/og, so the social preview never drifts from the brand.
export default function OpengraphImage() {
    return new ImageResponse(
        (
            <div
                style={{
                    background: "linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%)",
                    color: "#f8fafc",
                    display: "flex",
                    flexDirection: "column",
                    height: "100%",
                    justifyContent: "space-between",
                    padding: 72,
                    width: "100%",
                }}
            >
                <div style={{ alignItems: "center", display: "flex", gap: 16 }}>
                    <div
                        style={{
                            alignItems: "center",
                            background: "#6366f1",
                            borderRadius: 16,
                            display: "flex",
                            fontSize: 30,
                            fontWeight: 800,
                            height: 56,
                            justifyContent: "center",
                            width: 56,
                        }}
                    >
                        CS
                    </div>
                    <div style={{ fontSize: 34, fontWeight: 700 }}>CodeStreak</div>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
                    <div
                        style={{
                            display: "flex",
                            flexDirection: "column",
                            fontSize: 68,
                            fontWeight: 800,
                            letterSpacing: -2,
                            lineHeight: 1.15,
                        }}
                    >
                        <div>Code every day with a</div>
                        <div>community that keeps you moving.</div>
                    </div>
                    <div style={{ color: "#c7d2fe", fontSize: 30 }}>
                        GitHub streaks, habit insights, and Discord accountability.
                    </div>
                </div>

                <div style={{ color: "#94a3b8", display: "flex", fontSize: 24, gap: 28 }}>
                    <div>Next.js 15</div>
                    <div>·</div>
                    <div>TypeScript</div>
                    <div>·</div>
                    <div>GitHub API</div>
                    <div>·</div>
                    <div>Discord Bot</div>
                </div>
            </div>
        ),
        size
    )
}
