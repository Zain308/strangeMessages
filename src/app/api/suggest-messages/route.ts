import { NextResponse } from "next/server"
import { generateText } from "ai"
import { createGeminiProvider } from "ai-sdk-provider-gemini-cli"

const curatedFallback = [
  "What is one thing I do that makes you smile, and one thing I could do better?",
  "Share a moment when I surprised you (good or bad) and why it stood out.",
  "What's a habit of mine that's helpful—and one that's holding me back?",
  "If you could give me one piece of advice for the next 30 days, what would it be?",
  "What's something I don't notice about myself that others probably do?",
  "What should I start/stop/continue doing? Be specific.",
]

export async function POST() {
  const apiKey = process.env.GEMINI_API_KEY || "AIzaSyADP1h_sja2eRSMqbXIj0QJk08CZWd6sVI"

  // If no key, return curated suggestions
  if (!apiKey) {
    return NextResponse.json({
      success: true,
      message: curatedFallback.join("||"),
      fallback: true,
      provider: "fallback",
      model: null,
    })
  }

  try {
    const gemini = createGeminiProvider({
      authType: "api-key",
      apiKey,
    })

    const model = gemini("gemini-1.5-flash")

    const { text } = await generateText({
      model,
      prompt: [
        "You are helping users get meaningful anonymous feedback. Generate exactly 5 thoughtful question prompts that encourage honest, constructive feedback.",
        "Make them personal but not invasive, encouraging but not generic. Focus on growth, relationships, and self-awareness.",
        "Each question should be 10-25 words and feel natural to ask a friend or colleague.",
        "Avoid clichés like 'What's your biggest weakness' or overly personal questions.",
        'Output ONLY the 5 questions separated by "||" with no numbering, bullets, or extra text.',
        "Examples of good questions: 'What's something I do that I probably don't realize affects others?' or 'When do you see me at my best, and what brings that out?'",
      ].join("\n"),
      temperature: 0.8,
      maxTokens: 300,
    })

    const raw = text?.trim() ?? ""
    let message = raw

    // Sanitize to ensure "||" format, even if model adds newlines or numbers
    if (!message.includes("||")) {
      const normalized = raw
        .replace(/\r/g, "")
        .split("\n")
        .map((l) => l.trim())
        .filter(Boolean)
        .map((l) => l.replace(/^\d+[).]\s*/, "")) // strip "1) " or "1. "
        .filter(Boolean)
      message = normalized.join("||")
    }

    // As a final guard, if still not 5, pad from curatedFallback to keep UX consistent
    let parts = message
      .split("||")
      .map((s) => s.trim())
      .filter(Boolean)
    if (parts.length < 5) {
      parts = [...parts, ...curatedFallback].slice(0, 5)
      message = parts.join("||")
    }

    return NextResponse.json({
      success: true,
      message,
      fallback: false,
      provider: "gemini",
      model: "gemini-1.5-flash",
    })
  } catch (error) {
    console.error("suggest-messages error:", error)
    return NextResponse.json({
      success: true,
      message: curatedFallback.join("||"),
      fallback: true,
      provider: "fallback",
      model: null,
    })
  }
}
